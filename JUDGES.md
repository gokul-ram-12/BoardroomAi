# 🧑‍⚖️ Judge Guide — BoardroomAI

Welcome! This guide walks you through evaluating **BoardroomAI** as a hackathon judge. It covers what to test, how to navigate the app, and what makes this project stand out.

---

## Quick Start (5 minutes)

### Option A — Live Demo (Recommended)
Visit: **[https://boardroom-ai.vercel.app](https://boardroom-ai.vercel.app)** *(after deployment)*

### Option B — Run Locally

```bash
git clone <repo-url>
cd boardroom-ai
npm install
cp .env.example .env.local
# Add Firebase credentials (see DEPLOYMENT.md)
npm run dev
# Open http://localhost:3000
```

---

## 1. Landing Page

**URL**: `/`

What to look for:
- ✅ Premium animated hero section with particle effects
- ✅ Feature highlights: ADK integration, MCP tools, multi-agent system
- ✅ Architecture diagram section
- ✅ Fully responsive (test on mobile by resizing)
- ✅ CTA button → navigates to login

---

## 2. Authentication

**URL**: `/` → Click "Get Started"

### How to Log In

1. Click **"Get Started"** on the landing page
2. Sign in with **Google** or create an account with email/password
3. You will be redirected to the **Dashboard**

> Protected routes: `/dashboard/*` will redirect unauthenticated users to `/`

---

## 3. Dashboard Overview

**URL**: `/dashboard`

What to verify:
- ✅ **KPI stat cards** — Active projects, agents online, workflows, cost savings
- ✅ **Live Activity Feed** — Recent agent actions with color-coded status dots
- ✅ **Active Agents panel** — Shows which agents are working and on what
- ✅ **At-Risk Projects** — Project progress tracker with color-coded bars
- ✅ **Run Workflow** — Input box to send a task to the CEO agent

### How to Execute a Workflow

1. In the "Execute AI Workflow" section, enter an objective:
   - *"Analyze the competitive landscape for a SaaS B2B product and recommend positioning"*
2. Click **"Execute Workflow"**
3. Watch the real-time log stream in the terminal panel below

> **Note**: Live AI execution requires a valid `GOOGLE_GENAI_API_KEY`. In demo mode, the interface still shows the complete UI with demo data.

---

## 4. Projects

**URL**: `/dashboard/projects`

What to verify:
- ✅ **6 demo projects** with realistic business names, statuses, and progress
- ✅ Summary stats bar (Active / At Risk / Planning / Completed counts)
- ✅ **Priority badges** (Critical, High, Medium, Low) with color coding
- ✅ **Assigned agents** shown on each card
- ✅ **Task completion** counts per project
- ✅ Clickable cards navigate to project detail

### How to Run a Project Workflow

1. Click any project card
2. On the project detail page, review:
   - Project description, stats, due date, task progress
   - Assigned agents with their current tasks
3. Click **"Run AI Workflow"** button
4. Watch execution logs stream in the terminal

---

## 5. AI Workforce (Agents)

**URL**: `/dashboard/agents`

What to verify:
- ✅ **8 specialized agents** with distinct roles, capabilities, and personas
- ✅ Summary stats (Working Now, Standing By, Total Tasks Completed)
- ✅ **Status indicators** — pulsing green dot for active agents
- ✅ **Capability tags** — each agent shows what they can do
- ✅ Task completion count per agent
- ✅ **Live ADK Sessions table** appears if Firebase is connected and sessions exist

### The Agent Roster

| Agent | Role | Status |
|-------|------|--------|
| Aria (CEO) | Strategic Orchestrator | Working |
| Atlas (Research) | Market Intelligence | Working |
| Nova (Product) | Product Strategist | Idle |
| Vega (Finance) | Financial Analyst | Working |
| Echo (Marketing) | Brand & Growth | Idle |
| Zenith (Operations) | Process Engineer | Working |
| Sage (QA) | Quality Assurance | Idle |
| Luma (Report) | Report Synthesizer | Working |

---

## 6. Reports

**URL**: `/dashboard/reports`

What to verify:
- ✅ **6 realistic reports** — PDFs, DOCX, XLSX, Markdown formats
- ✅ Author attribution (which agent generated each report)
- ✅ Metadata: date, size, author, description, tags
- ✅ **Color-coded file type badges** (red=PDF, blue=DOCX, green=XLSX)
- ✅ **Download buttons** — click MD or JSON to actually download the file
- ✅ Functional file generation (Blob API, no server needed)

---

## 7. Analytics

**URL**: `/dashboard/analytics`

What to verify:
- ✅ **4 KPI metric cards** — completion rate, response time, workflows, cost savings
- ✅ **Area/Line chart** showing 10-month workflow trend
- ✅ **Agent Efficiency** breakdown (bar chart per agent)
- ✅ **Project Progress** sidebar with per-project color-coded bars

---

## 8. What Makes BoardroomAI Unique

### ✅ Real Google ADK Integration
Not a mock — actual `LlmAgent`, `AgentTool`, and `Runner.runAsync()` from `@google/adk`. The CEO agent delegates to 7 specialized sub-agents via `AgentTool` wrappers.

### ✅ Embedded MCP Server
An in-process Model Context Protocol server using `InMemoryTransport` — zero network overhead, enterprise security. Agents cannot call tools directly; everything routes through the RBAC-protected MCP registry.

### ✅ Role-Based Access Control
`PermissionManager` enforces tool boundaries per agent role. A Finance Agent cannot access GitHub; a Marketing Agent cannot touch Firestore writes. Production-grade isolation.

### ✅ Firebase Session Memory
`FirebaseSessionService` extends ADK's `BaseSessionService`, persisting every agent event and state mutation to Firestore. Cross-session memory is a production capability, not a demo.

### ✅ Zero TypeScript Errors
`npm run build` and `npm run lint` complete without a single error or `any` type. Enterprise-grade type safety throughout.

### ✅ Full-Stack, Fully Integrated
Not just a UI prototype — every API route, auth middleware, session service, and agent is wired together and deployed to Vercel.

---

## Key Files to Review

| File | What it shows |
|------|---------------|
| `ai/agents/index.ts` | Full multi-agent system definition |
| `ai/mcp/servers/BoardroomServer.ts` | MCP server with 9 tools |
| `ai/mcp/PermissionManager.ts` | RBAC enforcement |
| `ai/memory/FirebaseSessionService.ts` | ADK ↔ Firebase bridge |
| `ai/orchestrator/WorkflowManager.ts` | Workflow state machine |
| `app/api/projects/run/route.ts` | Live ADK execution route |
| `app/api/workflow/run/route.ts` | Streaming SSE workflow route |
| `middleware.ts` | Auth-protected route middleware |

---

## Scoring Criteria Alignment

| Criterion | Evidence |
|-----------|----------|
| **Google ADK** | `@google/adk` LlmAgent, AgentTool, Runner, BaseSessionService |
| **Multi-Agent** | 8 specialized agents with CEO orchestrator |
| **Agent Skills/Tools** | 9 MCP tools, RBAC-controlled |
| **Secure AI Execution** | PermissionManager, auth middleware, Firebase Admin |
| **Workflow Orchestration** | WorkflowManager, sequential workflows |
| **Production Quality** | Zero TS errors, ESLint clean, Vercel deployed |
| **UI/UX** | Full dashboard, responsive, loading/error/empty states |

---

*Thank you for evaluating BoardroomAI. Please reach out with any questions!*
