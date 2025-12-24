# Project Context

## Purpose
Resep Bunda ("Recipe Mom") is an Indonesian React Native app for recipe discovery and management. The app provides offline-first recipe storage with SQLite, user authentication, and features for creating, saving, and sharing recipes.

## Tech Stack
- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript (strict mode)
- **Navigation:** Expo Router (file-based routing)
- **Database:** SQLite (expo-sqlite) for offline-first storage
- **Session Storage:** AsyncStorage for tokens
- **UI Icons:** Lucide React Native, Expo Vector Icons
- **Fonts:** Inter, Mulish (Google Fonts)
- **Animations:** React Native Reanimated
- **Gestures:** React Native Gesture Handler

## Project Conventions

### Code Style
- TypeScript for all code with strict mode enabled
- PascalCase for components (e.g., `RecipeCard.tsx`)
- camelCase for variables, functions, and hooks
- Path aliases: `@/*` maps to project root
- ESLint with expo config for linting (`npm run lint`)

### Architecture Patterns
- **File-based routing** via Expo Router in `app/` directory
- **Route groups:**
  - `(auth)` - Authentication screens (login, register)
  - `(tabs)` - Main tab navigation (home, create, my-recipes, saved, profile)
  - `recipe/` - Recipe detail screens
  - `cooking/` - Cooking mode screens
- **Service layer** in `src/services/` for business logic and database operations
- **React Context** for state management (AuthProvider in `src/providers/`)
- **Theme system** in `src/theme/` with light/dark mode support
- UI components should call service functions, not direct database queries

### Testing Strategy
- QA team uses documented test plan in `docs/product_documents/`
- Bug fixes tracked in WBS.csv
- Run `npm run lint` before committing
- Mock user for testing: `bunda@example.com` / `Bunda123!`

### Git Workflow
- Main branch: `main`
- Feature branches: `feature/<name>` or `<developer>/<feature-name>`
- Conventional commits: `feat:`, `fix:`, `chore:`, etc.
- Pull requests required for merging to main

## Domain Context
- All user-facing text should be in **Indonesian (Bahasa Indonesia)**
- Recipe domain includes: ingredients, steps, categories, difficulty levels, cooking time
- User features: registration, login, profile management, recipe bookmarking
- Privacy settings for recipes: public vs private

## Important Constraints
- Offline-first architecture - app must work without internet
- SQLite is the primary data store (no external backend currently)
- Early development stage - many features not yet implemented
- Must support Android and iOS platforms

## External Dependencies
- No external APIs currently (self-contained with SQLite)
- Expo services for build and updates (EAS)
- Google Fonts for typography
