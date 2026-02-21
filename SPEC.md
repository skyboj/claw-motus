# SPEC.md — AI-Agent Tools for Web-MCP

## Overview
Implement a local Model Context Protocol (MCP) server that exposes the Claw Motus system to external AI agents. This allows external AI agents to act as automated production coordinators by reading pending quotes and manually triggering email responses.

## Key Goals
1. Provide an interface for AI agents to retrieve new, unprocessed quote requests.
2. Provide a tool for AI agents to explicitly trigger the Resend email delivery (disabling the automatic email dispatch currently in `functions/index.js`).
3. Maintain zero human-facing UI for analytics.

## Architectural Changes Required

### 1. Database Integration (Firestore)
Quote requests currently bypass a database and are immediately processed by Gemini + Resend inside the Cloud Function. To store them for external agents:
- Initialize Firebase **Firestore** database.
- Update `/api/quote` endpoint (in `functions/index.js`) to parse the incoming request, execute the Gemini classification step, and **save the resulting brief + original request as a document in a `quotes` Firestore collection**.
- Remove the automatic `resend.emails.send` blocks from the HTTP function. The HTTP function now ONLY saves to the database.

### 2. The MCP Server
Create a local Node.js application (e.g., in a `mcp-server/` directory or as a separate Firebase HTTP function wrapper designed for MCP) that implements the `@modelcontextprotocol/sdk`.

#### Resources / Prompts
- Provide a prompt or resource to list the current pending quote briefs stored in Firestore.

#### Tools
The server must expose the following tools to the LLM:

- `list_pending_quotes`: Retreives a list of quotes from Firestore where `status` is `pending`. Returns the client details, project description, and the pre-generated Gemini AI brief notes.
- `send_quote_email`: Takes a `quoteId` (from Firestore), optionally allows the AI agent to inject custom follow-up questions, and triggers the Resend API to dispatch the email to `production.boichenko@icloud.com` and the client. Marks the Firestore document as `status: 'emailed'`.

## Authentication & Security
- The MCP server requires Google Application Default Credentials or a Service Account Key to access the Firebase Admin SDK to read/write Firestore.
- API keys (Resend) must be loaded from local environment variables when run.
