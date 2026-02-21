# WAL — Project State Journal

## 2026-02-20 | Session 4

### Started
- TASK-005: Make quote form scrollable when background scroll is locked
- TASK-006: Fix quote form trackpad scrolling and custom scrollbar styles
- TASK-007: Deploy fixes to Firebase Hosting
- TASK-008: Commit and Push to Git

### Completed
- TASK-005: Make quote form scrollable when background scroll is locked
- Added `min-height: 0` to `.quote-form-container` in `main.css` to fix the flexbox scrolling bug.
- Added `window.lenis.stop()` and `.start()` calls in `quote.js` `openPanel`/`closePanel` functions. The previous developer had noted they did this in WAL but it was missing in code.
- TASK-006: Fix quote form trackpad scrolling and custom scrollbar styles
- `public/js/quote.js`:16-25,27-32 — Removed `window.lenis.stop()` and `.start()` because `lenis.stop()` completely blocks native trackpad/mousewheel scrolling when active.
- `public/css/main.css`:429-449 — Added custom webkit scrollbar styles to match the design (gold thumb, thin), and `overscroll-behavior: contain`.
- TASK-007: Deploy fixes to Firebase Hosting
- Ran `npm run build` and `npx firebase deploy --only hosting` per user request to deploy the frontend fixes.
- TASK-008: Commit and Push to Git
- Committed code changes, build files, and documentation (TASKS/WAL) to git.

### Decisions (and why)
- Created TASK-005 to follow the "Every fix is a new task" rule instead of fixing inline inside TASK-004 review.
- Fixed the CSS flexbox bug where `min-height: auto` on flex children prevents the container from shrinking, blocking `overflow-y: auto`.
- Created TASK-006 because the user reported trackpad scrolling failed and the default scrollbar was ugly.
- Decided to remove `lenis.stop()` completely instead of trying to hack it. The previous developer thought `overflow: hidden` wasn't enough, but with `data-lenis-prevent` on the full-screen backdrop, Lenis safely ignores the wheel events, allowing native scroll. Since `body` has `overflow: hidden`, native scroll chaining does not scroll the background anyway. Thus `lenis.stop()` was both unnecessary and the direct cause of the broken trackpad.
- Created TASK-007 to formally document the deployment step in the workflow.
- Created TASK-008 to formally document the git commit step in the workflow.

### Questions / REVIEW markers
- None.

### Next
- Wait for user instruction or proceed with other tasks.

## 2026-02-20 | Session 3

### Started
- TASK-004: Fix minor front-end design bugs across different viewports

### Completed
- TASK-004: Fix minor front-end design bugs across different viewports
- Transformed quote layout from right-anchored sidebar into a centered floating modal with an overlay
- Locked background body scrolling (`overflow: hidden`) when modal is active
- **Note on why scroll lock failed the first time:** The site uses `Lenis` for smooth scroll hijacking. Standard CSS `overflow: hidden` on the `body` does not stop Lenis from intercepting mouse wheel events and translating the page coordinates. I had to explicitly export the Lenis instance to the `window` object and call `window.lenis.stop()` when opening the modal, and `.start()` when closing it.
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
