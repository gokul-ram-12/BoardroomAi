# BoardroomAI 🤖

### Enterprise AI Operating System — Powered by Google ADK & MCP

BoardroomAI is a production-ready, multi-agent AI platform that transforms how enterprises work. Specialized AI agents — each with distinct roles, skills, and bounded capabilities — collaborate autonomously to complete complex business workflows: from financial analysis to competitive intelligence, product strategy to operational monitoring.

Built for the **Kaggle "AI Agents: Intensive Vibe Coding Capstone Project"**.

---

## The Problem

Modern enterprises are drowning in complexity. A single strategic initiative — say, a product launch — requires:

- Weeks of market research
- Days of financial modelling
- Cross-functional coordination across 5+ teams
- Endless document generation and review cycles

Existing tools automate individual tasks. **None orchestrate the entire workflow intelligently.**

## The Solution

BoardroomAI deploys a **CEO-led, multi-agent AI workforce** where:

- 🧠 **Aria (CEO Agent)** orchestrates all tasks and synthesizes decisions
- 🔬 **Atlas (Research Agent)** pulls competitive intelligence and market data
- 💰 **Vega (Finance Agent)** builds financial models and risk assessments
- 📦 **Nova (Product Agent)** manages roadmaps and feature specs
- 📢 **Echo (Marketing Agent)** generates campaigns and copy
- ⚙️ **Zenith (Operations Agent)** monitors pipelines and processes
- ✅ **Sage (QA Agent)** validates all agent outputs for accuracy
- 📄 **Luma (Report Agent)** synthesizes findings into executive-ready documents

Each agent runs through the **Google Agent Development Kit (ADK)** and accesses tools through a secure, embedded **Model Context Protocol (MCP)** server.

---

## Architecture

```
User (Dashboard)
      │
      ▼
 Next.js 16 App
 (React 19 Server/Client Components)
      │
      ├─── Firebase Auth ──── Firestore (Session Memory)
      │
      └─── AI Orchestration Layer
              │
              ├─── Google ADK Runner (runAsync)
              │       │
              │       └─── CEO Agent (LlmAgent)
              │               ├── Research Agent
              │               ├── Finance Agent
              │               ├── Product Agent
              │               ├── Marketing Agent
              │               ├── Operations Agent
              │               ├── QA Agent
              │               └── Report Agent
              │
              ├─── MCP Client (InMemoryTransport)
              │       └─── BoardroomServer (Embedded MCP)
              │               ├── project_management tools
              │               ├── file_access tools
              │               ├── analytics tools
              │               └── notification tools
              │
              ├─── PermissionManager (RBAC)
              │       └─── Maps AgentRole → Allowed Tools
              │
              └─── WorkflowManager (Orchestrator)
                      └─── State: pending → running → completed
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Language** | TypeScript (strict mode, zero `any`) |
| **AI Agents** | Google ADK (`@google/adk`) |
| **Tool Protocol** | Model Context Protocol (`@modelcontextprotocol/sdk`) |
| **Auth & DB** | Firebase Authentication + Firestore |
| **Styling** | Tailwind CSS v4 + shadcn/ui + Framer Motion |
| **Deployment** | Vercel (Free Tier) |
| **Linting** | ESLint + TypeScript strict |

---

## Google ADK Integration

BoardroomAI uses the **Google Agent Development Kit** for all agent execution:

```typescript
// CEO orchestrator agent
export const CEOAgent = new LlmAgent({
  name: 'BoardroomAI_CEO',
  model: 'gemini-2.0-flash',
  instruction: CEO_SYSTEM_PROMPT,
  subAgents: [ResearchAgent, FinanceAgent, ProductAgent, ...],
});

// Execution via runAsync
const events = runner.runAsync({ userId, sessionId, newMessage });
for await (const event of events) { /* stream events */ }
```

Each agent is isolated with a dedicated system prompt in `ai/prompts/` and constrained by `PermissionManager`.

---

## MCP Integration

An embedded **Model Context Protocol** server (`ai/mcp/servers/BoardroomServer.ts`) exposes 9 business tools through `InMemoryTransport`:

```typescript
// Agents access tools through the MCP registry (never directly)
const tool = createMCPProxyTool('search_web', 'Search the web', schema);

// PermissionManager enforces what each agent can access
PermissionManager.isAuthorized('Research', 'search_web'); // ✓ true
PermissionManager.isAuthorized('Finance', 'github_search'); // ✗ false
```

---

## Project Structure

```
BoardroomAI/
├── app/
│   ├── api/                # API routes (agents, workflow, mcp, reports)
│   ├── dashboard/          # Dashboard pages (Overview, Projects, Agents, Reports, Analytics)
│   ├── layout.tsx          # Root layout with auth provider
│   └── page.tsx            # Landing page
│
├── ai/
│   ├── agents/             # Agent definitions (CEO, Research, Finance, etc.)
│   ├── core/               # ADK Runner factory
│   ├── mcp/                # MCP Client, Server, PermissionManager, ToolRegistry
│   ├── memory/             # FirebaseSessionService (ADK ↔ Firestore)
│   ├── observability/      # Logger (latency, token tracking)
│   ├── orchestrator/       # WorkflowManager (state machines)
│   ├── prompts/            # System prompts for each agent
│   └── tools/              # Tool implementations
│
├── components/
│   ├── dashboard/          # AgentCard, ProjectCard, Charts, RunWorkflowButton
│   ├── landing/            # Hero, Features, Architecture, CTA sections
│   └── layout/             # Navbar, Sidebar, Footer
│
├── lib/
│   ├── firebase/           # Client & Admin SDK config
│   └── constants/          # Demo data (mockData.ts)
│
├── types/                  # Shared TypeScript interfaces
├── contexts/               # React Auth Context
└── middleware.ts            # Firebase auth middleware (route protection)
```

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-username/boardroom-ai.git
cd boardroom-ai
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email/Password + Google)
4. Create a **Firestore** database (start in test mode)
5. Generate a **Service Account** key (Project Settings → Service Accounts)

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Firebase Client (from Firebase Console → Project Settings → Your apps)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...

# Firebase Admin (from Service Account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google AI (Gemini)
GOOGLE_GENAI_API_KEY=your-gemini-api-key
```

### 4. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

> ✅ The project is fully compatible with Vercel's Free Tier.

---

## Features

| Feature | Status |
|---------|--------|
| 🏠 Landing Page | ✅ Complete |
| 🔐 Firebase Authentication | ✅ Complete |
| 📊 Dashboard Overview | ✅ Complete |
| 📁 Project Management | ✅ Complete |
| 🤖 Multi-Agent System (ADK) | ✅ Complete |
| 🔧 MCP Tool Server | ✅ Complete |
| 🔒 RBAC Permission System | ✅ Complete |
| 📈 Analytics Dashboard | ✅ Complete |
| 📄 Report Generation | ✅ Complete |
| 🧠 Firebase Session Memory | ✅ Complete |
| 🔄 Workflow Orchestration | ✅ Complete |
| 📱 Responsive Design | ✅ Complete |

---

## Future Scope

- **Real-time streaming** — SSE/WebSocket for live agent event feeds
- **Custom agent builder** — No-code agent configuration UI
- **File ingestion** — PDF/CSV upload for agents to analyze
- **MCP marketplace** — Connect to external MCP servers (GitHub, Notion, Slack)
- **Multi-tenant workspaces** — Team collaboration with shared agent pools
- **Agent memory graph** — Long-term cross-session knowledge persistence

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built with ❤️ for the Kaggle AI Agents Capstone Project*
