# RehaBot: AI-Powered Rehabilitation Assistant

## Overview

RehaBot is a healthcare-focused web application that generates personalized recovery routines using Google's Gemini AI. The application creates structured 3-day rehabilitation programs with motivational, exercise, and cognitive activities tailored to each user's injury type, mobility level, and recovery goals.

The system emphasizes visual presentation over plain text, using interactive UI cards, timelines, and modals to display routines. Users can edit routines inline, track progress, export to PDF, and share their recovery plans.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR and optimized production builds
- **Wouter** for lightweight client-side routing (single-page application)
- **TanStack Query** for server state management, caching, and API request handling

**UI & Styling**
- **Tailwind CSS** for utility-first styling with custom healthcare theme
- **Shadcn/ui** component library built on Radix UI primitives (New York style variant)
- **Framer Motion** for smooth animations and transitions throughout the interface
- Custom design system with specific color palette:
  - Primary Blue: `#0F62FE`
  - Secondary Teal: `#00B4D8`
  - Accent Lavender: `#7F96FF`
  - Dark gradient backgrounds with translucent card overlays
- Three theme modes: light, dark (default), and high-contrast for accessibility

**State Management**
- LocalStorage for persisting routines client-side
- React Context for theme management
- Component-level state for UI interactions (modals, editors, run mode)

**Key Features**
- Multi-step onboarding modal to collect user rehabilitation preferences
- Interactive routine cards with inline editing capabilities
- Run mode for step-by-step routine execution with timer
- PDF export using jsPDF library
- JSON import/export for routine portability

### Backend Architecture

**Server Framework**
- **Express.js** on Node.js for REST API endpoints
- TypeScript throughout the backend for type consistency
- ES modules (type: "module" in package.json)

**API Design**
- `/api/generate` - POST endpoint that proxies requests to Gemini AI
- `/api/save` - POST endpoint for saving routines to file storage
- `/api/load/:id` - GET endpoint for retrieving saved routines
- All requests/responses validated using Zod schemas

**AI Integration**
- Google Gemini AI (`@google/genai` v1.28.0) for routine generation
- Server-side API key storage (environment variable `GEMINI_API_KEY`)
- Structured JSON prompts ensure consistent routine format
- Response validation against Zod schemas before returning to client

**Error Handling**
- Distinction between validation errors (400) and server errors (500)
- Informative error messages returned to client
- Gemini API key validation with helpful error message if missing

### Data Storage Solutions

**Database**
- **PostgreSQL** via Neon serverless driver (`@neondatabase/serverless`)
- **Drizzle ORM** (v0.39.1) for type-safe database operations
- Schema includes users table (authentication ready, though not currently implemented)
- Database migrations managed via `drizzle-kit`

**File Storage**
- In-memory storage implementation (`MemStorage` class) for routine persistence
- File-based storage in `data/routines/` directory
- Each routine saved with unique UUID identifier
- Metadata support for additional routine information

**Client Storage**
- LocalStorage for browser-based routine caching
- Enables offline routine access and reduces API calls

### External Dependencies

**AI Service**
- **Google Gemini API** - Core AI service for generating personalized rehabilitation routines
  - Requires `GEMINI_API_KEY` environment variable
  - Used exclusively on server-side to protect API credentials
  - Generates structured JSON responses with 3-day routines containing motivational, exercise, and cognitive blocks

**Database**
- **Neon Serverless PostgreSQL** - Primary database (configured but minimal current usage)
  - Connection via `DATABASE_URL` environment variable
  - Serverless architecture for automatic scaling
  - Currently defines user schema; routine data primarily handled via file storage

**Font Services**
- **Google Fonts CDN** - Typography resources
  - Inter/DM Sans for UI text
  - JetBrains Mono for monospace displays (timers, durations)
  - Architects Daughter, Fira Code, Geist Mono also available

**UI Component Library**
- **Radix UI** - Headless component primitives (20+ components)
  - Provides accessible, unstyled UI foundations
  - Wrapped with Tailwind styling via Shadcn/ui
  - Includes dialogs, dropdowns, accordions, tooltips, and more

**Development Tools**
- **Replit-specific plugins** for development environment integration
  - Vite runtime error modal overlay
  - Cartographer for code navigation
  - Dev banner for development mode indication

**PDF Generation**
- **jsPDF** - Client-side PDF export functionality
  - Enables users to download routines as PDF documents
  - No server-side processing required

**Data Validation**
- **Zod** with Drizzle integration - Runtime schema validation
  - Validates API requests/responses
  - Type-safe schema definitions shared between client and server
  - Ensures data integrity throughout the application
