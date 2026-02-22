const { onRequest } = require("firebase-functions/v2/https");
const { getAppCheck } = require("firebase-admin/app-check");
const { initializeApp } = require("firebase-admin/app");
const express = require("express");
const rateLimit = require("express-rate-limit");
const { GoogleGenAI } = require("@google/genai");
const { Resend } = require("resend");

// Initialize Firebase Admin for App Check and Firestore
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(express.json());
app.set("trust proxy", 1); // Trust first proxy (Firebase Load Balancer) to fix express-rate-limit error

// 1. Rate Limiter (Max 5 requests per IP per hour)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many requests. Please try again later." }
});
app.use(limiter);

// System prompt for Anthropic
const SYSTEM_PROMPT = `You are a professional video production coordinator at Claw Motus, a Bay Area video production company. Your job is to analyze incoming quote requests and prepare a structured production brief for the founder.

Given the client's project information, respond ONLY with a valid JSON object using these exact keys:

{
  "summary": "2–3 sentence professional summary of the project",
  "projectType": "detected project category",
  "followUpQuestions": ["question 1", "question 2", "question 3"],
  "potentialChallenges": ["challenge 1", "challenge 2"],
  "scopeEstimate": "general scope — crew size, shoot days, likely deliverables",
  "priorityLevel": "low | medium | high — based on timeline and budget",
  "internalNotes": "anything the founder should know before responding to this client"
}

Be concise and specific to video production. Consider Bay Area logistics, typical event/startup needs, and turnaround expectations. Do not include any text outside the JSON object.`;

// 2. The API Endpoint
app.post(["/quote", "/api/quote"], async (req, res) => {
  console.log("Incoming request path:", req.path);
  // --- A. Security Checks ---

  // App Check Verification (uncomment in production once enforced)
  // const appCheckToken = req.headers["x-firebase-appcheck"];
  // if (!appCheckToken) {
  //   res.status(401).send("Unauthorized");
  //   return;
  // }
  // try {
  //   await getAppCheck().verifyToken(appCheckToken);
  // } catch (err) {
  //   res.status(401).send("Unauthorized");
  //   return;
  // }

  // Honeypot field — if 'website' is filled, silently reject
  if (req.body.website) {
    return res.status(200).json({ ok: true, message: "Silent reject" });
  }

  // --- B. Extract Lead Data ---
  const { name, email, company, projectType, eventDate, location, budget, description } = req.body;

  if (!name || !email || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // --- C. Anthropic Claude Processing ---
  let aiResult = {};

  try {
    const geminiKey = process.env.GEMINI_API_KEY; // Set via Firebase Secrets
    if (!geminiKey) throw new Error("GEMINI_API_KEY not set");

    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const userMessage = `
      Client: ${name}
      Company: ${company || "N/A"}
      Project Type: ${projectType}
      Date: ${eventDate || "Not specified"}
      Location: ${location || "Bay Area"}
      Budget: ${budget}
      Description: ${description}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    try {
      const rawText = response.text;
      // The API enforces JSON response type, so we try parsing directly
      aiResult = JSON.parse(rawText);
    } catch (parseErr) {
      console.warn("Failed to parse Gemini JSON", parseErr);
      throw new Error("Parse Error");
    }
  } catch (aiErr) {
    console.error("AI Error:", aiErr);
    // Graceful fallback if Gemini is down
    aiResult = {
      summary: "AI analysis skipped due to API error.",
      projectType: projectType || "Unknown",
      followUpQuestions: [],
      potentialChallenges: [],
      scopeEstimate: "Manual review required.",
      priorityLevel: "medium",
      internalNotes: "Error communicating with AI service."
    };
  }

  // --- D. Send Client Confirmation Email ---
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Claw Motus <quotes@clawmotus.com>",
      to: email,
      subject: "We received your quote request",
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <p>Hi ${name},</p>
          <p>Thanks for reaching out to Claw Motus! We've received your details regarding the <strong>${projectType}</strong> project.</p>
          <p>Our team is reviewing your requirements now and will get back to you with a tailored quote shortly.</p>
          <br>
          <p>Best regards,<br>The Claw Motus Team</p>
        </div>
      `,
    });
    console.log("Client confirmation email sent to:", email);
  } catch (emailErr) {
    console.error("Failed to send client confirmation:", emailErr);
  }

  // --- E. Send Founder Notification Email ---
  try {
    const briefHTML = `
      <h3>New Quote Request: ${projectType}</h3>
      <hr/>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || "N/A"}</p>
      <p><strong>Date:</strong> ${eventDate || "N/A"}</p>
      <p><strong>Location:</strong> ${location || "N/A"}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Description:</strong> ${description}</p>
      <hr/>
      <h4>AI Analysis:</h4>
      <p><strong>Summary:</strong><br/>${aiResult.summary}</p>
      <p><strong>Scope Estimate:</strong><br/>${aiResult.scopeEstimate}</p>
      <p><strong>Priority Level:</strong> ${aiResult.priorityLevel}</p>
      <br/>
      <p><strong>Potential Challenges:</strong></p>
      <ul>
        ${(aiResult.potentialChallenges || []).map(c => `<li>${c}</li>`).join("")}
      </ul>
      <p><strong>Follow-Up Questions:</strong></p>
      <ul>
        ${(aiResult.followUpQuestions || []).map(q => `<li>${q}</li>`).join("")}
      </ul>
      <br/>
      <p><strong>Internal Notes:</strong><br/>${aiResult.internalNotes}</p>
    `;

    await resend.emails.send({
      from: "Claw Motus AI <quotes@clawmotus.com>",
      to: "production.boichenko@icloud.com",
      subject: `New Lead: ${projectType} - ${name}`,
      html: briefHTML,
    });
    console.log("Founder notification email sent.");
  } catch (emailErr) {
    console.error("Failed to send founder notification:", emailErr);
  }

  // --- F. Save to Firestore Database ---
  try {
    const newQuote = {
      name,
      email,
      company: company || "N/A",
      projectType,
      eventDate: eventDate || "N/A",
      location: location || "N/A",
      budget,
      description,
      aiSummary: aiResult.summary,
      aiBrief: aiResult,
      status: "emailed", // Updated since we skip the MCP detour
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("quotes").add(newQuote);
    console.log("Successfully saved new quote request to Firestore.");
  } catch (dbErr) {
    console.error("Firestore Save Error:", dbErr);
  }

  // Respond to frontend
  res.status(200).json({ ok: true, summary: aiResult.summary });
});

// Export the express app wrapped as an HTTPS function
exports.api = onRequest({ secrets: ["GEMINI_API_KEY", "RESEND_API_KEY"], cors: true }, app);
