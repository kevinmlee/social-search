# Client Folder Reorganization Plan

## Problem
The `client/` folder has its own `package.json` with React 18, causing conflicts with our React 19 installation.

## Solution
Move all source code from `client/src/` to root `src/` directory, then remove the entire `client/` folder.

## Step-by-Step Plan

### 1. Move Source Files
```bash
# Move the entire src directory to root
mv client/src src

# This preserves the structure:
# src/
# ├── views/
# ├── components/
# ├── lib/
# ├── util/
# └── api/
```

### 2. Update Path Aliasing in jsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]  // Changed from "./client/src/*"
    }
  }
}
```

### 3. Update Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',  // Changed from './client/src/**'
  ],
  // ...
}
```

### 4. Remove Client Folder Entirely
```bash
rm -rf client/
```

### 5. Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

## What Gets Removed

From `client/`:
- ❌ `package.json` (has React 18 - causing conflict)
- ❌ `package-lock.json`
- ❌ `node_modules/`
- ❌ `build/`
- ❌ `config-overrides.js` (CRA config)
- ❌ `netlify/` (functions already migrated)
- ❌ `public/` (already copied to root public/)
- ❌ `jest.config.js` (duplicate)

## What Gets Kept (moved to root src/)

From `client/src/`:
- ✅ `views/` → `src/views/`
- ✅ `components/` → `src/components/`
- ✅ `lib/` → `src/lib/`
- ✅ `util/` → `src/util/`
- ✅ `api/` → `src/api/`
- ✅ `icons/` → `src/icons/`
- ✅ `assets/` → `src/assets/`
- ✅ `workers/` → `src/workers/`

## Benefits

1. ✅ **No more React version conflicts**
2. ✅ **Simpler project structure**
3. ✅ **Single node_modules**
4. ✅ **Cleaner root directory**
5. ✅ **Standard Next.js structure**

## Final Structure

```
social-search/
├── app/                    # Next.js App Router
├── src/                    # Source code (moved from client/src)
│   ├── views/
│   ├── components/
│   ├── lib/
│   ├── util/
│   └── api/
├── lib/                    # Shared utilities (cn() function)
├── public/                 # Static assets
├── package.json            # Single package.json (React 19)
└── [config files]
```

## Execution Commands

Run these commands in order:

```bash
# 1. Move source files
mv client/src src

# 2. Update jsconfig.json (manual edit)
# 3. Update tailwind.config.js (manual edit)

# 4. Remove client folder
rm -rf client

# 5. Clean install
rm -rf node_modules package-lock.json
npm install

# 6. Test
npm run dev
```

## Verification

After migration, check:
- [ ] All imports still work (`@/views/...`)
- [ ] Tailwind finds all components
- [ ] No React version warnings
- [ ] `npm run dev` starts successfully
- [ ] All pages load correctly
