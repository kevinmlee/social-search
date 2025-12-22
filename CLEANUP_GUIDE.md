# Cleanup Guide - Removing Legacy Files

This document lists files and directories that can be safely removed after the Next.js migration.

## Files to Remove

### 1. Netlify-Specific Files

```bash
# Remove Netlify Functions (now replaced with Next.js API routes)
rm -rf client/netlify/

# Remove Netlify configuration
rm -rf .netlify/

# Remove Netlify redirects
rm client/public/_redirects
```

### 2. Create React App Configuration

```bash
# Remove CRA configuration
rm client/config-overrides.js
rm client/package.json
rm client/package-lock.json

# Remove react-scripts build output
rm -rf client/build/
```

### 3. Old Client Source (Optional - Keep for Reference)

**IMPORTANT**: The `client/src/` directory contains your view components that are still being used by the new Next.js app. **DO NOT DELETE** until you've verified all components work.

However, you can remove these unused files from `client/src/`:
```bash
# Remove old App.js (replaced by app/ directory structure)
rm client/src/App.js

# Remove old styles (already copied to app/styles/)
# Keep these if you're still migrating components
# rm -rf client/src/styles/
```

### 4. Old Server Files (if not needed)

```bash
# Legacy Express server (not used in Next.js)
rm server.js

# Old API implementations (replaced by app/api/)
rm -rf api/

# Old data models (if using MongoDB directly)
rm data.js
```

### 5. Legacy Build Files

```bash
# Old build artifacts
rm -rf build/
rm -rf dist/
rm -rf .next/ # (will be regenerated on build)
```

## Safe Cleanup Commands

Run these commands from the root directory to clean up safely:

```bash
# 1. Remove Netlify files
rm -rf .netlify
rm -rf client/netlify
rm -f client/public/_redirects

# 2. Remove CRA configuration
rm -f client/config-overrides.js

# 3. Remove old build files
rm -rf client/build
rm -rf build
rm -rf dist

# 4. Remove legacy server files (optional)
rm -f server.js
rm -rf api
rm -f data.js

# 5. Clean node_modules and reinstall
rm -rf node_modules
rm -rf client/node_modules
npm install
```

## Files to KEEP

### Keep These Critical Directories:

✅ **`client/src/views/`** - Your React components (still used)
✅ **`client/src/components/`** - Shared components (still used)
✅ **`client/src/lib/`** - Helper utilities (still used)
✅ **`client/src/util/`** - Utility functions (still used)
✅ **`client/src/api/`** - API client functions (need updating, but keep)
✅ **`public/`** - Static assets (migrated but keep original for reference)

### Keep These Configuration Files:

✅ **`.env`** - Environment variables
✅ **`next.config.js`** - Next.js configuration
✅ **`tailwind.config.js`** - Tailwind configuration
✅ **`postcss.config.js`** - PostCSS configuration
✅ **`jsconfig.json`** - Path aliasing
✅ **`package.json`** - Dependencies (root)
✅ **`.eslintrc.json`** - ESLint configuration
✅ **`.gitignore`** - Git ignore rules

## Verification Steps

Before deleting anything, verify:

1. **Test the app works:**
   ```bash
   npm run dev
   ```

2. **Check all pages load:**
   - Home page (/)
   - Reddit (/reddit)
   - YouTube (/youtube)
   - Trends (/trends/test)
   - Profile (/profile)
   - Settings (/settings)
   - Sign In (/signin)
   - Sign Up (/signup)

3. **Test API routes:**
   ```bash
   # Test location API
   curl http://localhost:3000/api/location
   ```

4. **Verify no broken imports:**
   ```bash
   npm run build
   ```

## Post-Cleanup Actions

After cleanup:

1. **Update .gitignore:**
   ```
   # Add to .gitignore
   .next/
   node_modules/
   .env*.local
   ```

2. **Run fresh install:**
   ```bash
   npm install
   ```

3. **Test build:**
   ```bash
   npm run build
   npm start
   ```

4. **Commit changes:**
   ```bash
   git add .
   git commit -m "Complete Next.js migration and cleanup legacy files"
   ```

## Gradual Cleanup Strategy

If you're cautious, follow this gradual approach:

### Phase 1: Remove Safe Files (Do First)
- Netlify files
- Old build outputs
- CRA config files

### Phase 2: Test Thoroughly
- Run dev server
- Test all features
- Verify API routes work

### Phase 3: Remove Server Files (If Confirmed Unused)
- server.js
- api/ directory
- data.js

### Phase 4: Final Cleanup
- Old styles (after confirming new styles work)
- Any remaining unused files

## Rollback Plan

If something breaks:

1. **Git reset:**
   ```bash
   git status
   git checkout -- <file>
   ```

2. **Restore from backup:**
   - Keep a backup of the repository before cleanup
   - Or use git branches

3. **Reinstall dependencies:**
   ```bash
   npm install
   ```

## File Size Reduction

Expected size reduction after cleanup:

- **Before:** ~500MB (with all node_modules)
- **After:** ~300MB (single node_modules, no duplicates)
- **Savings:** ~40% reduction in repository size

## Questions?

If you're unsure about deleting a file:
1. Check if it's imported anywhere (search in IDE)
2. Keep it for now
3. Review after a week of successful operation

---

**Next Steps:**
1. Review this guide
2. Backup your repository (git branch or zip)
3. Run cleanup commands gradually
4. Test after each phase
5. Commit when confirmed working
