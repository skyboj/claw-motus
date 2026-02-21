require('dotenv').config();
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema
} = require("@modelcontextprotocol/sdk/types.js");

// Initialize Firebase Admin SDK to access Firestore securely
const admin = require("firebase-admin");
// Note: We use application default credentials. Ensure GOOGLE_APPLICATION_CREDENTIALS exists.
const app = admin.initializeApp({
    projectId: "clawmotus-default-id" // Set fallback project ID if needed
});
const db = admin.firestore();

// Setup Resend API
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const server = new Server(
    {
        name: "claw-motus-agent",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
            resources: {},
        },
    }
);

// -------------------------------------------------------------
// RESOURCES: Provide access to the pending quote lists directly
// -------------------------------------------------------------
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: "quotes://pending",
                name: "Pending Quote Requests",
                mimeType: "application/json",
                description: "A live JSON list of all quote requests that have not been emailed to the client yet."
            }
        ]
    };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    if (request.params.uri === "quotes://pending") {
        try {
            const snapshot = await db.collection("quotes")
                .where("status", "==", "pending")
                .orderBy("createdAt", "desc")
                .get();

            const quotes = [];
            snapshot.forEach(doc => {
                quotes.push({ id: doc.id, ...doc.data() });
            });

            return {
                contents: [
                    {
                        uri: request.params.uri,
                        mimeType: "application/json",
                        text: JSON.stringify(quotes, null, 2)
                    }
                ]
            };
        } catch (e) {
            console.error("Error reading from Firestore:", e);
            throw new Error(`Database error: ${e.message}`);
        }
    }

    throw new Error("Resource not found");
});

// -------------------------------------------------------------
// TOOLS: Provide actions the agent can take (Emailing)
// -------------------------------------------------------------
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "list_pending_quotes",
                description: "Retrieves a list of pending quotes from the database that need a response.",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: []
                }
            },
            {
                name: "send_quote_email",
                description: "Sends the quote response email to the client containing the generated brief and optional follow-up questions.",
                inputSchema: {
                    type: "object",
                    properties: {
                        quoteId: {
                            type: "string",
                            description: "The unique Firestore document ID of the quote request"
                        },
                        agentNotes: {
                            type: "string",
                            description: "Optional custom notes or follow-up questions formulated by the AI agent to include in the email."
                        }
                    },
                    required: ["quoteId"]
                }
            }
        ]
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "list_pending_quotes") {
        try {
            const snapshot = await db.collection("quotes")
                .where("status", "==", "pending")
                .orderBy("createdAt", "desc")
                .get();

            const quotes = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                quotes.push({
                    id: doc.id,
                    clientName: data.name,
                    company: data.company,
                    projectType: data.projectType,
                    budget: data.budget,
                    aiSummary: data.aiSummary,
                    aiBrief: data.aiBrief
                });
            });

            return {
                content: [{ type: "text", text: JSON.stringify(quotes, null, 2) }]
            };
        } catch (e) {
            return {
                content: [{ type: "text", text: `Error fetching quotes: ${e.message}` }],
                isError: true,
            };
        }
    }

    if (request.params.name === "send_quote_email") {
        const { quoteId, agentNotes } = request.params.arguments;

        try {
            // 1. Fetch the document
            const docRef = db.collection("quotes").doc(quoteId);
            const docSnap = await docRef.get();

            if (!docSnap.exists) {
                throw new Error(`Quote ID ${quoteId} not found.`);
            }

            const quoteData = docSnap.data();
            if (quoteData.status !== "pending") {
                throw new Error(`Quote is already marked as ${quoteData.status}.`);
            }

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
        <p><strong>Scope Estimate:</strong><br/>${aiBrief.scopeEstimate}</p>
      `;

            if (agentNotes) {
                htmlEmail += `<br/><p><strong>Follow-Up:</strong></p><p>${agentNotes.replace(/\\n/g, '<br/>')}</p>`;
            } else if (aiBrief.followUpQuestions && aiBrief.followUpQuestions.length > 0) {
                htmlEmail += `<br/><p><strong>Follow-Up Questions:</strong></p><ul>`;
                aiBrief.followUpQuestions.forEach(q => {
                    htmlEmail += `<li>${q}</li>`;
                });
                htmlEmail += `</ul>`;
            }

            htmlEmail += `
        <br/>
        <p>Let's schedule a brief call to pin down logistics.</p>
        <p>Best,<br/>O. Boichenko<br/><strong>Claw Motus</strong></p>
      `;

            // 3. Send using Resend
            await resend.emails.send({
                from: "quotes@clawmotus.com",
                to: email, // Bcc founder if desired
                bcc: "production.boichenko@icloud.com",
                subject: `Claw Motus — Project Quote: ${projectType}`,
                html: htmlEmail,
            });

            // 4. Update Database
            await docRef.update({
                status: "emailed",
                emailedAt: admin.firestore.FieldValue.serverTimestamp(),
                agentNotesProvided: agentNotes || null
            });

            return {
                content: [{ type: "text", text: `Success: Email sent to ${email} and quote status marked as 'emailed'.` }]
            };

        } catch (e) {
            return {
                content: [{ type: "text", text: `Error sending email: ${e.message}` }],
                isError: true,
            };
        }
    }

    throw new Error("Tool not found");
});

// Start server on stdio transport
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Claw Motus Web-MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
