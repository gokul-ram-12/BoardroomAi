# BoardroomAI — System Architecture

## Overview

BoardroomAI is a **multi-agent AI operating system** that coordinates specialized AI agents to perform complex enterprise workflows. It is built on three foundational pillars:

1. **Google ADK** — Agent runtime, orchestration, and tool execution
2. **Model Context Protocol (MCP)** — Secure, structured tool access for agents
3. **Firebase** — Authentication, persistent session memory, and Firestore data store

---

## High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER CLIENT                                │
│  Landing Page / Auth  ──►  Protected Dashboard (Next.js 16)          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────────────┐
│                       VERCEL EDGE RUNTIME                            │
│                                                                      │
│  Next.js Middleware (Firebase Auth Token Verification)               │
│  ┌───────────────────────────────────────────────────────────┐      │
│  │                  Next.js App Router                        │      │
│  │  /dashboard/*  →  Protected Server/Client Components       │      │
│  │  /api/*        →  API Route Handlers (Node.js)             │      │
│  └───────────────────────────────────────────────────────────┘      │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
              ┌────────────────┼─────────────────┐
              ▼                ▼                 ▼
    ┌─────────────┐  ┌──────────────┐  ┌────────────────┐
    │  Firebase   │  │  Google ADK  │  │  MCP Server    │
    │    Auth     │  │   Runtime    │  │  (Embedded)    │
    │  Firestore  │  │  (Node.js)   │  │  InMemory      │
    └─────────────┘  └──────┬───────┘  └───────┬────────┘
                            │                  │
                    ┌───────▼──────────────────▼──────────────┐
                    │            AI Orchestration Layer         │
                    │                                           │
                    │   CEO Agent (Aria)                        │
                    │      ├─ Research Agent (Atlas)            │
                    │      ├─ Finance Agent (Vega)              │
                    │      ├─ Product Agent (Nova)              │
                    │      ├─ Marketing Agent (Echo)            │
                    │      ├─ Operations Agent (Zenith)         │
                    │      ├─ QA Agent (Sage)                   │
                    │      └─ Report Agent (Luma)               │
                    └───────────────────────────────────────────┘
```

---

## Authentication Flow

```
User → Sign In Form
           │
           ▼
   Firebase Auth Client SDK
   (Email/Google OAuth)
           │
     ID Token issued
           │
     Stored in cookie (httpOnly)
           │
           ▼
   Next.js Middleware
   verifies token on every request
   using Firebase Admin SDK
           │
     ┌─────┴──────┐
     │            │
   VALID        INVALID
     │            │
     ▼            ▼
  Dashboard    Redirect to /
```

---

## Multi-Agent Orchestration

### Agent Hierarchy

```
CEO Agent (LlmAgent — gemini-2.0-pro)
    │
    ├── receives task from user
    ├── analyzes context & scope
    ├── delegates via AgentTool calls
    │
    ├── AgentTool → Research Agent
    │                └── [web search, file access, GitHub]
    │
    ├── AgentTool → Finance Agent
    │                └── [analytics, firestore, search]
    │
    ├── AgentTool → Product Agent
    │                └── [project mgmt, search, firestore]
    │
    ├── AgentTool → Marketing Agent
    │                └── [search, analytics]
    │
    ├── AgentTool → Operations Agent
    │                └── [project mgmt, notifications, firestore]
    │
    ├── AgentTool → QA Agent
    │                └── [search, file access]
    │
    └── AgentTool → Report Agent
                    └── [reports, export, file access, firestore]
```

### Execution Lifecycle

```
POST /api/projects/run
        │
        ▼
  WorkflowManager.create()
  Status: pending → running
        │
        ▼
  createRunner(CEOAgent)
        │
        ▼
  runner.runAsync({ userId, sessionId, newMessage })
        │
        ▼  (async generator — event stream)
  for await (event of events) { ... }
        │
        ▼
  Session saved to Firestore via FirebaseSessionService
        │
        ▼
  WorkflowManager.updateStepStatus('completed')
        │
        ▼
  Response: { workflowId, sessionState }
```

---

## MCP Tool Server

### Architecture Pattern

```
Agent (LlmAgent)
    │
    │ calls tool via ADK
    ▼
MCPToolRegistry.createMCPProxyTool()
    │
    │ routes via InMemoryTransport
    ▼
BoardroomServer (MCP Server)
    │
    │ dispatches to handler
    ▼
Tool Implementation
    │
    │ returns result
    ▼
Agent receives structured response
```

### Tool Categories

| Category | Tools | Authorized Agents |
|----------|-------|-------------------|
| Project Management | list_projects, update_project | CEO, Product, Operations |
| Search | web_search | All agents |
| File Access | read_file, write_file | Research, QA, Report |
| Analytics | get_analytics, get_metrics | Finance, Marketing |
| Firestore | read_db, write_db | Finance, Product, Operations, Report |
| GitHub | search_repos | Research |
| Notifications | send_notification | CEO, Operations |
| Reports | generate_report, export_report | Report |

### RBAC Permission Matrix

```typescript
// PermissionManager enforces per-agent tool access
{
  CEO:        ['Project', 'Notifications', 'Search'],
  Research:   ['Search', 'FileAccess', 'GitHub'],
  Product:    ['Project', 'Search', 'Firestore'],
  Marketing:  ['Search', 'Analytics'],
  Finance:    ['Analytics', 'Firestore', 'Search'],
  Operations: ['Project', 'Notifications', 'Firestore'],
  Report:     ['Reports', 'Export', 'FileAccess', 'Firestore'],
  QA:         ['Search', 'FileAccess'],
}
```

---

## Session Memory (Firebase + ADK)

```
ADK Agent Execution
        │
        ▼
FirebaseSessionService (extends BaseSessionService)
    ├── createSession()   → Firestore: adk_sessions/{id}
    ├── getSession()      → Firestore read
    ├── listSessions()    → Firestore query by userId
    └── deleteSession()   → Firestore delete

Each session stores:
  - events: Event[]        (agent conversation history)
  - state: Record<string>  (key-value working memory)
  - userId, appName
  - lastUpdateTime: number
```

---

## Database Schema (Firestore)

```
/adk_sessions/{sessionId}
  ├── id: string
  ├── appName: "BoardroomAI"
  ├── userId: string
  ├── events: Array<Event>
  ├── state: Record<string, unknown>
  └── lastUpdateTime: number
```

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/agents/run` | Execute a workflow via the CEO Agent |
| GET | `/api/agents/status` | List active ADK sessions |
| POST | `/api/mcp/execute` | Call an MCP tool directly |
| POST | `/api/projects/run` | Run a project-scoped workflow |
| GET | `/api/reports/[id]` | Fetch a specific report |
| POST | `/api/reports/generate` | Trigger report generation |
| GET | `/api/tasks` | List current tasks |
| GET | `/api/workflow/history` | List recent workflow executions |
| POST | `/api/workflow/run` | Streaming workflow execution (SSE) |
| GET | `/api/health` | Health check |

---

## Observability

`ai/observability/Logger.ts` provides structured logging:

```
{
  timestamp: ISO string,
  level: "info" | "warn" | "error",
  agent: string,
  tool: string,
  latencyMs: number,
  tokenUsage: { input: number, output: number },
  workflowId: string,
}
```

---

## Security Model

| Layer | Mechanism |
|-------|-----------|
| Network | Firebase ID Token (httpOnly cookie) |
| Route protection | Next.js Middleware + Admin SDK verify |
| Agent tool access | PermissionManager RBAC |
| MCP transport | InMemoryTransport (no network exposure) |
| Firestore rules | userId-scoped read/write rules |
| Environment secrets | Vercel encrypted env vars (never client-exposed) |

---

## Technology Decisions

| Decision | Rationale |
|----------|-----------|
| **Embedded MCP** over microservice | No cold-start latency, no network surface, simpler deployment |
| **InMemoryTransport** | Secure IPC between agent and server within same process |
| **Firebase** over Postgres | Serverless-native, no connection pooling needed, real-time capable |
| **Next.js App Router** | Hybrid SSR/CSR, Route Handlers natively support streaming |
| **Strict TypeScript** | Zero runtime panics from type coercion in production |
