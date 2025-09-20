# VetFlow - Veterinary Practice Management System

## Overview

VetFlow is a comprehensive veterinary practice management system designed specifically for veterinarians in Pakistan. The application provides tools for managing both livestock (cows, buffaloes, goats) and pets (dogs, cats) across rural and urban areas. It features multilingual support (English/Urdu), disease diagnosis capabilities, record management, vaccination tracking, inventory control, appointment scheduling, and outbreak reporting. The system is built as a full-stack web application with modern React frontend and Express.js backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible interface
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Internationalization**: Custom translation system supporting English and Urdu with RTL text support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework using TypeScript
- **API Design**: RESTful API endpoints following conventional HTTP methods
- **Data Storage**: In-memory storage implementation with interface-based architecture for future database integration
- **Validation**: Zod schemas for request/response validation shared between frontend and backend
- **Error Handling**: Centralized error handling middleware with structured error responses

### Data Management
- **Schema Definition**: Drizzle ORM schema definitions in TypeScript for PostgreSQL
- **Data Models**: Comprehensive entities for animals, visit records, vaccinations, inventory, appointments, and disease outbreaks
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database implementations
- **Data Validation**: Shared Zod schemas ensuring type safety across the full stack

### Application Features
- **Symptom Checker**: Knowledge-based disease diagnosis system with local disease database
- **Record Management**: Complete animal and visit record tracking with owner information
- **Vaccination System**: Schedule tracking with PVMC compliance and automated reminders
- **Inventory Control**: Stock management with low-stock alerts and expiration tracking
- **Appointment Scheduling**: Calendar-based booking system with reminder capabilities
- **Outbreak Reporting**: Disease outbreak tracking with geographic data and biosafety protocols
- **Analytics Dashboard**: Productivity calculations, welfare scoring, and AMR risk assessment

## External Dependencies

### Database Integration
- **Drizzle ORM**: Database toolkit with PostgreSQL dialect configuration
- **Neon Database**: Serverless PostgreSQL driver for cloud database connectivity
- **Migration System**: Drizzle Kit for database schema migrations and version control

### UI and Styling
- **Radix UI**: Headless UI components providing accessibility and keyboard navigation
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Consistent icon library for user interface elements
- **shadcn/ui**: Pre-built component library built on Radix UI primitives

### Development Tools
- **Vite**: Fast build tool with hot module replacement and TypeScript support
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment plugins for hot reloading and error handling

### Core Libraries
- **React Query**: Server state management with caching, background updates, and optimistic updates
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for runtime type checking
- **Date-fns**: Date manipulation utilities for scheduling and time calculations
- **Wouter**: Minimalist routing library for single-page application navigation