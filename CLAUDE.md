# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

UIGen — an AI-powered React component generator with live preview. Users describe components in a chat interface, an LLM generates code via tool calls into a virtual file system, and a live preview renders the result in an iframe.

## Commands

- `npm run setup` — install deps, generate Prisma client, run migrations (first-time setup)
- `npm run dev` — start dev server with Turbopack (requires `--require ./node-compat.cjs`)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run test` — vitest (jsdom environment, no watch by default)
- `npx vitest run src/lib/__tests__/file-system.test.ts` — run a single test file
- `npx prisma migrate dev` — apply schema changes
- `npm run db:reset` — reset SQLite database

## Architecture

### Request Flow

1. User sends a message via `ChatProvider` (`src/lib/contexts/chat-context.tsx`) which wraps `@ai-sdk/react`'s `useChat`
2. `POST /api/chat` route (`src/app/api/chat/route.ts`) receives messages + serialized virtual file system
3. The route uses Vercel AI SDK's `streamText` with two tools: `str_replace_editor` and `file_manager`
4. Tool calls stream back to the client; `FileSystemProvider` (`src/lib/contexts/file-system-context.tsx`) applies them to the client-side `VirtualFileSystem`
5. `PreviewFrame` (`src/components/preview/PreviewFrame.tsx`) detects file changes via `refreshTrigger`, transforms JSX with Babel standalone, builds an import map with blob URLs, and renders in a sandboxed iframe

### Virtual File System

`src/lib/file-system.ts` — `VirtualFileSystem` class used on both server (in the chat route to execute tool calls) and client (to maintain state). Files live only in memory; nothing is written to disk. The VFS is serialized as `Record<string, FileNode>` and sent with every chat request.

### AI Tools (LLM-facing)

- `str_replace_editor` (`src/lib/tools/str-replace.ts`) — view, create, str_replace, insert operations on virtual files
- `file_manager` (`src/lib/tools/file-manager.ts`) — rename and delete operations

### Preview Pipeline

`src/lib/transform/jsx-transformer.ts` handles:
- Babel transformation of JSX/TSX to JS
- Import map generation (local files → blob URLs, third-party packages → esm.sh)
- `@/` alias resolution mapping to root of virtual FS
- CSS file collection and injection
- Syntax error display in preview

### Mock Provider

When `ANTHROPIC_API_KEY` is not set, `src/lib/provider.ts` provides a `MockLanguageModel` that returns canned component code. This allows the app to run without an API key.

### Auth & Persistence

- JWT-based auth via `jose` (`src/lib/auth.ts`), cookie-stored sessions
- Prisma + SQLite (`prisma/schema.prisma`) — `User` and `Project` models
- Projects store serialized messages and file system data as JSON strings
- Anonymous users can use the app; work is tracked client-side via `anon-work-tracker`

### Code Style

- Use comments sparingly — only comment complex code
- Path alias: `@/*` maps to `./src/*`
- UI components from shadcn/ui in `src/components/ui/`
- Tailwind CSS v4 (configured via `@tailwindcss/postcss`)
- Next.js App Router with async `params` in page components
- The generation prompt (`src/lib/prompts/generation.tsx`) requires all projects to have a root `/App.jsx` as the entry point
