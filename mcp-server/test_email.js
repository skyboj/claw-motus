require('dotenv').config();
const admin = require("firebase-admin");

// Note: Ensure GOOGLE_APPLICATION_CREDENTIALS exists.
const app = admin.initializeApp({
    projectId: "claw-motus" // Fixed to actual project ID just in case
});
const db = admin.firestore();

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function runTest() {
    console.log("Fetching pending quotes from Firestore...");
    try {
        const snapshot = await db.collection("quotes")
            .where("status", "==", "pending")
            .orderBy("createdAt", "desc")
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log("No pending quotes found to test.");
            process.exit(0);
        }

        const doc = snapshot.docs[0];
        const quoteData = doc.data();
        console.log(`Found quote: ${quoteData.name} - ${quoteData.summary || quoteData.aiSummary}`);

        // 2. Build the Email
        const { name, email, projectType, aiSummary, aiBrief } = quoteData;

        let htmlEmail = `
        <h3>Quote Request Received — ${projectType}</h3>
        <hr/>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to Claw Motus regarding your ${projectType} project. I’ve reviewed the details you submitted.</p>
        <br/>
        <p><strong>Initial Assessment:</strong><br/>${aiSummary}</p>
        <br/>
        <p><strong>Scope Estimate:</strong><br/>${aiBrief ? aiBrief.scopeEstimate : 'N/A'}</p>
        `;

        console.log("Dispatching email via Resend...");

        const response = await resend.emails.send({
            from: "quotes@clawmotus.com",
            to: "production.boichenko@icloud.com", // Using your verified iCloud to test delivery
            subject: `TEST EMAIL — Claw Motus — Project Quote: ${projectType}`,
            html: htmlEmail,
        });

        console.log("Resend API Response:", response);
        if (response.error) {
            console.error("Resend Error:", response.error);
        } else {
            console.log("Success! Updating document in Firestore...");
            await doc.ref.update({
                status: "emailed",
                emailedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log("Test Completed.");
        }

    } catch (e) {
        console.error("Test failed:", e);
    }
}

runTest();
