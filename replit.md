# replit.md

## Overview

SteroidTracker is a professional web application for tracking anabolic steroid cycles, designed with medical-grade security and user experience. The application combines a React frontend with an Express.js backend, PostgreSQL database, and Replit's authentication system to provide comprehensive cycle management capabilities.

## System Architecture

### Full-Stack TypeScript Application
- **Frontend**: React 18 with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state

### Deployment Strategy
- **Development**: Vite dev server with Express backend
- **Production**: Static build served by Express with autoscale deployment
- **Database**: Neon serverless PostgreSQL

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui with Radix UI primitives
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form with Zod validation
- **Mobile-First**: Progressive Web App (PWA) design

### Backend Architecture
- **API Structure**: RESTful endpoints with Express.js
- **Database Access**: Drizzle ORM with connection pooling
- **Session Management**: PostgreSQL session store
- **File Uploads**: Multer for progress photo handling
- **Error Handling**: Centralized error middleware

### Database Schema
- **Users**: Gamification system with XP, levels, and streaks
- **Courses**: Steroid cycle management with compounds
- **Injections**: Detailed injection logging with sites and pain tracking
- **Blood Tests**: Laboratory result tracking with alert flags
- **Progress Photos**: Visual progress documentation
- **Achievements**: Gamification rewards system

## Data Flow

### Authentication Flow
1. Replit Auth handles OAuth with session persistence
2. PostgreSQL session store maintains user state
3. Protected routes verify authentication status
4. Automatic redirect to login on 401 errors

### Application Data Flow
1. React components fetch data via TanStack Query
2. API requests include credentials for session validation
3. Express routes interact with Drizzle ORM
4. PostgreSQL returns data through connection pool
5. Frontend updates with optimistic UI patterns

### File Upload Flow
1. Multer processes multipart form data
2. Files stored in local uploads directory
3. Static file serving through Express
4. Database stores file paths and metadata

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection with WebSocket support
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI primitives
- **framer-motion**: Animation library
- **date-fns**: Date manipulation utilities

### Authentication
- **openid-client**: OAuth/OIDC implementation
- **passport**: Authentication middleware
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution
- **tailwindcss**: Utility-first CSS framework
- **postcss**: CSS processing

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Process**: TSX executes server with hot reload
- **Port**: 5000 with Vite dev server integration
- **Database**: Requires DATABASE_URL environment variable

### Production Build
- **Build**: `npm run build` - Vite frontend + esbuild server
- **Start**: `npm run start` - Node.js production server
- **Deployment**: Replit autoscale with PostgreSQL-16 module
- **Static Assets**: Served from dist/public directory

### Database Management
- **Schema**: Defined in shared/schema.ts
- **Migrations**: Generated in migrations directory
- **Push**: `npm run db:push` applies schema changes
- **Connection**: Neon serverless with connection pooling

## Changelog

```
Changelog:
- June 19, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```