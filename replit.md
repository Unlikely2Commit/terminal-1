# Terminal 1

## Overview

Terminal 1 is a fintech SaaS application designed for financial advisory firms. It provides a unified platform for advisors to manage client relationships, workflows, compliance, and meeting recordings through an AI-powered command interface. The application features a dark-themed, modern UI with multiple specialized dashboards for different operational needs.

Key features include:
- AI-powered command interface with streaming responses
- Client management with FactFind auto-population from meeting transcripts
- Workflow automation for pension transfers, ISA top-ups, and protection policies
- Compliance monitoring with risk radar and triage systems
- Meeting recording and transcription management
- Agent management for automated provider chases and account openings
- Executive and advisor-level MI dashboards

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite
- Single-page application with client-side routing via Wouter
- Component library: shadcn/ui (New York style) with Radix UI primitives
- Styling: Tailwind CSS v4 with CSS variables for theming
- State management: TanStack React Query for server state, React hooks for local state
- Animations: Framer Motion for UI transitions

**Directory Structure**:
- `client/src/pages/` - Route-level page components
- `client/src/components/` - Shared components including Layout and Sidebar
- `client/src/components/ui/` - shadcn/ui component library
- `client/src/hooks/` - Custom React hooks
- `client/src/lib/` - Utilities and query client configuration

**Design Pattern**: The app uses a fixed sidebar layout with a scrollable main content area. Each page is self-contained with mocked data for demo purposes.

### Backend Architecture

**Framework**: Express.js with TypeScript
- RESTful API endpoints under `/api/`
- Separate entry points for development (`index-dev.ts`) and production (`index-prod.ts`)
- Development uses Vite middleware for HMR; production serves static files

**Key Modules**:
- `server/routes.ts` - API route definitions with multer for file uploads
- `server/storage.ts` - Database abstraction layer implementing `IStorage` interface
- `server/db.ts` - Drizzle ORM database connection
- `server/github.ts` - GitHub integration via Octokit (for connectors)

### Data Layer

**ORM**: Drizzle ORM with PostgreSQL dialect
- Schema defined in `shared/schema.ts` using drizzle-zod for validation
- Database migrations output to `/migrations`

**Schema Entities**:
- `users` - User accounts with roles (advisor, admin, compliance, ops)
- `messages` - Activity log storing command history
- `userSettings` - Calendar connection and recording preferences
- `recordings` - Client meeting recordings metadata

### Build System

- Vite for frontend bundling with React plugin
- esbuild for server bundling in production
- TypeScript with path aliases (`@/` for client, `@shared/` for shared code)
- PostCSS with Tailwind CSS processing

## External Dependencies

### Database
- **PostgreSQL** via Neon Serverless (`@neondatabase/serverless`)
- Connection requires `DATABASE_URL` environment variable
- WebSocket support for serverless connections

### Third-Party Services
- **GitHub API** via `@octokit/rest` for repository integration
- Uses Replit Connectors for OAuth token management

### File Storage
- Local file uploads via multer to `/uploads` directory
- Supports audio/video files up to 500MB

### UI Dependencies
- Full shadcn/ui component library with Radix UI primitives
- Recharts for data visualization
- Embla Carousel for carousel components
- Sonner for toast notifications
- react-day-picker for calendar components

### Development Tools
- Replit-specific plugins: runtime error overlay, cartographer, dev banner
- Custom Vite plugin for OpenGraph meta image handling