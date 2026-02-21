# WAL — Project State Journal

## 2026-02-20 | Session 3

### Started
- TASK-004: Fix minor front-end design bugs across different viewports

### Completed
- TASK-004: Fix minor front-end design bugs across different viewports
- Transformed quote layout from right-anchored sidebar into a centered floating modal with an overlay
- Locked background body scrolling when modal is active
- Removed Budget and Location fields from form and Javascript payload

### Decisions (and why)
- User decided to upload media files manually at a later date. Reverting TASK-003 back to `[ ]` and skipping it for now.

### Questions / REVIEW markers
- Stopped on TASK-004. What specific design bugs need fixing across viewports?

### Next
- Proceed with TASK-004 after frontend evaluation.


## 2026-02-20 | Session 2

### Started
- TASK-002: Implement AI-agent tools for Web-MCP

### Completed
- TASK-002: Implement AI-agent tools for Web-MCP
- Deployed Firebase Cloud Function updates to save to Firestore rather than auto-emailing.
- Scaffolding local `mcp-server` app with @modelcontextprotocol/sdk to expose Firestore to AI agents.
- None yet

### Decisions (and why)
- Will pivot the Cloud Function to save quotes to Firestore instead of automatically emailing.
- Created `SPEC.md` to define the architectural transition needed to decouple the intake form from the email dispatch so an MCP agent can sit in the middle.

### Questions / REVIEW markers
- Stopped on TASK-002. Need specification: what exactly do the Web-MCP AI-agent tools need to do? Waiting for human input.

### Next
- TASK-002 in progress, waiting for human explanation/spec.


## 2026-02-20 | Session

### Started
- TASK-001: Add auto-responder email to the Client with confirmation of the quote request
- Project initialization and transition to TASKS.md workflow

### Completed
- TASK-001: Add auto-responder email to the Client with confirmation of the quote request
- Initial v3 codebase deployed to Firebase and pushed to GitHub
- Fixed backend route `404` by adjusting Express routes mapping
- Repaired email delivery and Gemini AI fallback handling by mapping correct environment variables

### Decisions (and why)
- Transitioned to the BOOT/WAL/TASKS structure based on global user rules.
- Set `trust proxy` in express to handle requests proxied via Google Cloud Load Balancer.

### Questions / REVIEW markers
- None yet

### Next
- Proceed with TASK-001 or other top priorities from TASKS.md
