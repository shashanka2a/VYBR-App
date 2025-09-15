# Mobile PWA - Next.js 14 Project

## Overview
A modern mobile-first Progressive Web App built with Next.js 14, featuring a clean tab-based interface for community discovery, AI chat, roommate matching, and event management.

## Project Architecture
- **Framework**: Next.js 14 with Pages Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives for accessibility
- **Icons**: Lucide React
- **PWA Features**: Service worker, manifest, offline support

## Recent Changes (September 15, 2025)
- Set up project for Replit environment
- Configured Next.js to bind to 0.0.0.0:5000 for development
- Added cross-origin request handling for Replit proxy
- Configured conditional build settings (development vs production)
- Set up deployment configuration for static export
- Installed all dependencies and verified functionality

## Replit Configuration
- **Development**: Uses `npm run dev` on port 5000 with host 0.0.0.0
- **Production Build**: Uses static export (`npm run export`) for deployment
- **Deployment**: Configured for autoscale with static serving

## Key Files
- `pages/index.tsx`: Main application entry point with tab navigation
- `pages/_app.tsx`: App wrapper with PWA service worker registration
- `next.config.js`: Environment-specific configuration for dev/prod
- `src/components/`: Reusable UI components and tab implementations
- `public/`: PWA assets (manifest, service worker, icons)

## User Preferences
- Mobile-first responsive design
- PWA functionality with offline support
- Tab-based navigation interface
- Modern design system with Tailwind CSS