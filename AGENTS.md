# AGENTS.md - Developer Guide for ATSChecker

## Project Overview

ATSChecker is a Next.js 15 application that analyzes resumes/CVs against job descriptions using AI (OpenAI/DeepSeek). Built with React 19, TypeScript, Tailwind CSS v4, and Motion for animations.

## Commands

### Development
```bash
npm run dev          # Start dev server with Turbopack (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
```

### Linting & Type Checking
```bash
npm run lint         # Run ESLint (next lint)
```

### Single Test
No test framework is currently configured. Tests would be run via:
- Jest: `npm test` or `npx jest`
- Vitest: `npm test` or `npx vitest`

If adding tests, prefer Vitest for this Next.js project:
```bash
npm install -D vitest @vitejs/plugin-react
```

## Code Style Guidelines

### General Principles
- **Language**: TypeScript (strict mode enabled)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 with `cn()` utility for class merging

### TypeScript Configuration
- `tsconfig.json` uses strict mode
- Path alias: `@/*` maps to `./src/*`
- Module resolution: `bundler`
- Target: ES2015

### Imports

**External packages:**
```typescript
import React from 'react';
import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { useDropzone } from 'react-dropzone';
```

**Local imports (use path alias):**
```typescript
import CVUploader from '@/components/CVUploader';
import { cn } from '@/utils/className';
import type { Props } from '@/types';
```

**React types:**
```typescript
const MyComponent: React.FC = () => { };
const ref = useRef<HTMLDivElement>(null);
interface Props { ... }
```

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `CVUploader.tsx`)
- Utils/hooks: `camelCase.ts` / `camelCase.tsx` (e.g., `debounce.ts`, `useMergeRefs.tsx`)
- API routes: `route.ts` in folder (e.g., `src/app/api/parse-file/route.ts`)

**Components:**
- Default export with named function:
```typescript
export default function ComponentName() { }
```
- Props interface above component:
```typescript
interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export default function ComponentName({ isOpen, setIsOpen }: Props) { }
```

**Variables/Functions:**
- camelCase: `const handleAnalyze`, `function analyzeResume()`
- Unused variables: prefix with `_` (e.g., `_error`, `_ref`)

### Component Structure

```typescript
'use client';

import React from 'react';
import { cn } from '@/utils/className';

interface Props {
  // props definition
}

export default function ComponentName({ prop1, prop2 }: Props) {
  // hooks
  // handlers
  // render
}
```

### Error Handling

**API Routes:**
```typescript
export async function POST(request: Request) {
  try {
    // logic
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Error message' }), { status: 500 });
  }
}
```

- Use `_error` prefix for caught errors that aren't used
- Return proper HTTP status codes (400 for bad input, 500 for server errors)
- Handle edge cases explicitly (e.g., file type validation)

**Client Components:**
```typescript
try {
  // async operation
} catch (_error) {
  alert('Error message');
  // or set error state
}
```

### Tailwind CSS

**Class merging utility:**
Always use `cn()` from `@/utils/className` for conditional classes:
```typescript
import { cn } from '@/utils/className';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className // allows override
)} />
```

**Common patterns in this project:**
- Rounded corners: `rounded-2xl`
- Borders: `border-2 border-dashed border-blue-300`
- Shadows/overlays: `bg-white/90`, `bg-black/50`
- Grid: `grid place-content-center`

### ESLint Rules

The project uses custom ESLint rules (see `eslint.config.mjs`):
- `no-console`: error (use console.warn/error sparingly)
- `@typescript-eslint/no-unused-vars`: off (allow `_` prefix for unused vars)
- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-this-alias`: off
- `react-hooks/exhaustive-deps`: warning (0)

**Uncaught unused variables pattern:**
```typescript
// This is ALLOWED - underscore prefix signals intentional unused
} catch (_error) {
```

### API Routes

- Place in `src/app/api/[route]/route.ts`
- Export HTTP methods: `GET`, `POST`, etc.
- Set runtime when needed:
```typescript
export const runtime = 'edge'; // or 'nodejs'
```
- Return `Response` objects with appropriate status codes

### Environment Variables

Create `.env.local` for local development:
```bash
OPENAI_API_KEY=your_key_here
OPENAI_BASE_URL=https://api.deepseek.com/v1
```

### File Organization

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── parse-file/
│   │   └── openai/
│   ├── layout.tsx
│   └── page.tsx       # Main page
├── components/        # React components
│   ├── CVUploader/
│   ├── Result/
│   └── ...
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
└── types/            # TypeScript types (if needed)
```

### Key Dependencies

- **Runtime**: next@15.2.1, react@19.0.0, react-dom@19.0.0
- **AI**: openai@4.86.2
- **File Parsing**: pdf-parse, mammoth
- **UI**: react-dropzone, motion, react-icons
- **Styling**: tailwindcss@4, tailwind-merge, clsx
- **Editor**: @mdxeditor/editor

## Common Tasks

### Adding a new API route
1. Create folder in `src/app/api/`
2. Add `route.ts` file
3. Export HTTP methods

### Adding a new component
1. Create folder in `src/components/`
2. Create `index.ts` for clean exports
3. Create `ComponentName.tsx` with component
4. Use `cn()` for conditional Tailwind classes

### Adding environment variable
1. Add to `.env.local`
2. Document in project README
3. Access via `process.env.VARIABLE_NAME`

## Notes

- No test framework is currently configured
- Uses `patch-package` for dependency patches (postinstall)
- Indonesian comments present in some files (acceptable)
- Streaming responses supported in API routes
