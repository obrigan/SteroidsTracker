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
- June 21, 2025. Major UI/UX improvements and component integration:
  * Fixed database connection by pushing schema to create missing tables
  * Enhanced button styles with better variants, sizes, and touch targets
  * Improved modal dialogs with glass effects and rounded corners
  * Integrated AI Insights, Smart Reminders, and Advanced Achievements components
  * Connected SocialHub to Social page for community features
  * Enhanced FloatingActionButton with gradient design
  * Updated CSS with mobile-first responsive improvements
  * Fixed TypeScript errors in Profile page
  * Added new button variants (success, warning) and sizes (fab)
- June 21, 2025. Comprehensive Telegram Mini App Integration:
  * Created complete Telegram WebApp API service with haptic feedback
  * Implemented QR scanner for quick data import from medical devices
  * Added bot integration with cloud storage sync and smart notifications
  * Built social sharing system for achievements and progress
  * Enhanced PWA manifest for better Telegram integration
  * Integrated all components into Dashboard with conditional Telegram features
  * Added comprehensive error handling and user feedback systems
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
UI/UX Preferences: Modern, mobile-first design with rounded corners, gradients, and smooth animations.
Telegram Mini App Requirements: PWA optimization, Telegram WebApp API integration, haptic feedback.
```

## Development Recommendations

### UI/UX Best Practices
1. **Mobile-First Design**: Always design for mobile screens first, then enhance for desktop
2. **Touch Targets**: Ensure all interactive elements are at least 44px (touch-target class)
3. **Consistent Styling**: Use design system components with consistent colors and spacing
4. **Smooth Animations**: Use framer-motion for micro-interactions and page transitions
5. **Glass Effects**: Apply backdrop-blur for modern overlay appearances

### Component Architecture
1. **Modular Components**: Keep components focused and reusable
2. **Type Safety**: Always use TypeScript interfaces for props and data
3. **Error Handling**: Implement proper error states and loading indicators
4. **Accessibility**: Include proper ARIA labels and keyboard navigation

### Performance Optimization
1. **Code Splitting**: Use dynamic imports for large components
2. **Image Optimization**: Compress images and use appropriate formats
3. **Bundle Analysis**: Regularly check bundle size with webpack-bundle-analyzer
4. **Caching Strategy**: Implement proper caching for API calls and static assets

### Database Best Practices
1. **Schema Design**: Keep schemas simple and focused
2. **Migrations**: Always use db:push for schema changes
3. **Data Validation**: Use Zod schemas for both client and server validation
4. **Connection Pooling**: Utilize connection pooling for better performance