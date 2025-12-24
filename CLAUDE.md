<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resep Bunda ("Recipe Mom") is an Indonesian React Native app for recipe discovery and management. The app provides offline-first recipe storage with SQLite, user authentication, and features for creating, saving, and sharing recipes.

**Tech Stack:**
- React Native with Expo SDK 54
- TypeScript
- SQLite (expo-sqlite) for primary storage
- Expo Router for file-based navigation
- AsyncStorage for session tokens

## Development Commands

```bash
# Start development server
npx expo start

# Platform-specific starts
npx expo start --android
npx expo start --ios
npx expo start --web

# Lint code
npm run lint

# Reset project (if needed)
npm run reset-project
```

## Architecture & Key Concepts

### Navigation Structure
- **File-based routing** using Expo Router
- `(auth)` folder - Authentication screens (login, register)
- `(tabs)` folder - Main app tabs:
  - `index` - Home feed with recipe discovery
  - `create` - Create new recipe
  - `my-recipes` - User's recipes (Published/Draft tabs)
  - `saved` - Bookmarked recipes
  - `profile` - User profile
- `modal.tsx` - Modal screen for overlays

### Authentication Flow
- Custom auth system using SQLite (no external providers)
- Session stored in SQLite `session` table
- Auth guard in `app/_layout.tsx` redirects unauthenticated users
- Mock user available: `bunda@example.com` / `Bunda123!`

### Database Architecture
- **SQLite** for primary data storage
- Schema defined in `src/services/db/schema.ts`
- Current tables: `users`, `session`
- Database client in `src/services/db/client.ts`
- Note: Recipe schema not yet implemented - check for updates

### State Management
- React Context for authentication (`AuthProvider`)
- Local state for UI components
- No Redux/Zustand - keep it simple

### Styling System
- Centralized theme in `src/theme/index.ts`
- Colors defined in `constants/theme.ts`
- Support for light/dark mode
- Fonts: Inter and Mulish from Google Fonts

## Development Guidelines

### File Organization
```
src/
├── services/     # Business logic, database operations
├── providers/    # React Context providers
├── types/        # TypeScript type definitions
├── theme/        # Global theming
├── constants/    # Static configuration
├── hooks/        # Custom React hooks
└── utils/        # Helper functions
```

### Code Style
- Use TypeScript for all new code
- Follow PascalCase for components, camelCase for variables/functions
- Database operations should be in `src/services/`
- UI components call service functions, not direct database queries

### Testing & QA
- QA team uses documented test plan in `docs/product_documents/`
- Bug fixes tracked in WBS.csv
- Code review process managed by dedicated reviewer

### Project Management
- WBS (Work Breakdown Structure) tracks all tasks and dependencies
- Each developer assigned specific modules
- Status updates in WBS.csv

## Key Features to Implement

Based on the project roadmap:

1. **Recipe Discovery** - Home feed with search and category filters
2. **Recipe Management** - Create, edit, delete with privacy settings
3. **User Authentication** - Login/register with session persistence
4. **Saved Recipes** - Bookmark functionality
5. **Profile Management** - User profiles with editing capabilities

## Team Structure

- Project Manager & QA: Lutfi Zain
- Code Reviewer: R. Purba Kusuma
- 7 Developers handling specific modules
- Check WBS.csv for module assignments

## Important Notes

- The project is currently in early development - many features are not yet implemented
- Database schema for recipes is still pending
- Use the mock user for testing authentication
- All text should be in Indonesian (Bahasa Indonesia)
- Follow the existing code patterns and naming conventions