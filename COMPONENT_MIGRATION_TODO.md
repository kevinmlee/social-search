# Component Migration TODO

## Status: Core Layout Components Migrated ✅

Your Next.js setup is complete and the critical layout components (Header and Sidebar) have been migrated!

**Completed:**
- ✅ Header.jsx - Migrated to Tailwind + Lucide icons
- ✅ UserInput.jsx - Migrated to Next.js navigation + Tailwind
- ✅ User.jsx - Migrated to Next.js navigation + Tailwind (removed User.module.css)
- ✅ Sidebar.jsx - Migrated to Next.js navigation + Tailwind (removed Sidebar.css)

**Remaining components still use:**
- React Router (needs to be replaced with Next.js navigation)
- Material-UI (needs to be replaced with Tailwind CSS)

## Files That Need Updating

### React Router Dependencies (5 files remaining)
These files import from `react-router-dom` and need to use Next.js navigation:

1. `src/views/Recover/Recover.jsx`
2. `src/views/Trends/Trends.js`
3. `src/views/SignIn/SignIn.js`
4. `src/views/SignUp/SignUp.jsx`
5. `src/views/Platforms/Reddit/Reddit.jsx`
6. `src/views/Platforms/YouTube/YouTube.jsx`

~~5. `src/views/Sidebar/Sidebar.jsx`~~ ✅ **DONE**
~~8. `src/views/Header/components/UserInput.jsx`~~ ✅ **DONE**
~~9. `src/views/Header/components/User.jsx`~~ ✅ **DONE**

### MUI Dependencies (17 files remaining)
These files import from `@mui/material` and need Tailwind CSS + regular HTML:

1. `src/components/Loader/Loader.js`
2. `src/components/Filter/Filter.js`
3. `src/views/Profile/Profile.jsx`
4. `src/views/Home/Post.jsx`
5. `src/views/Home/Home.jsx`
6. `src/views/Settings/Settings.jsx`
7. `src/views/Recover/Recover.jsx`
8. `src/views/Trends/Trends.js`
9. `src/views/SignIn/SignIn.js`
10. `src/views/SignUp/SignUp.jsx`
11. `src/views/Platforms/Reddit/Post.jsx`
12. `src/views/Platforms/Reddit/Reddit.jsx`
13. `src/views/Platforms/Instagram/index.js`
14. `src/views/Platforms/Twitter/Twitter.js`
15. `src/views/Platforms/YouTube/YouTube.jsx`
16. `src/views/Platforms/YouTube/Post.jsx`
17. `src/views/LayoutSelector/index.js`

~~11. `src/views/Sidebar/Sidebar.jsx`~~ ✅ **DONE**
~~18. `src/views/Header/components/UserInput.jsx`~~ ✅ **DONE**
~~19. `src/views/Header/components/User.jsx`~~ ✅ **DONE**
~~20. `src/views/Header/Header.jsx`~~ ✅ **DONE**

## Migration Patterns

### Pattern 1: React Router → Next.js Navigation

#### Before (React Router):
```javascript
import { useNavigate, Link, useParams } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()
  const { id } = useParams()

  const handleClick = () => {
    navigate('/profile')
  }

  return (
    <div>
      <Link to="/home">Home</Link>
      <button onClick={handleClick}>Go to Profile</button>
    </div>
  )
}
```

#### After (Next.js):
```javascript
'use client' // Add this if component uses hooks

import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

function MyComponent() {
  const router = useRouter()
  const { id } = useParams()

  const handleClick = () => {
    router.push('/profile')
  }

  return (
    <div>
      <Link href="/home">Home</Link>
      <button onClick={handleClick}>Go to Profile</button>
    </div>
  )
}
```

### Pattern 2: MUI Components → Tailwind + HTML

#### Before (MUI):
```javascript
import { Box, Button, TextField, CircularProgress } from '@mui/material'

function MyForm() {
  return (
    <Box sx={{ padding: 2, maxWidth: 400 }}>
      <TextField
        label="Email"
        variant="filled"
        fullWidth
      />
      <Button variant="contained" color="primary">
        Submit
      </Button>
      <CircularProgress />
    </Box>
  )
}
```

#### After (Tailwind):
```javascript
function MyForm() {
  return (
    <div className="p-8 max-w-md">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit
      </button>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  )
}
```

### Pattern 3: MUI Icons → Lucide React

#### Before (MUI Icons):
```javascript
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'

<MenuIcon />
<CloseIcon />
<SearchIcon />
```

#### After (Lucide React):
```javascript
import { Menu, X, Search } from 'lucide-react'

<Menu size={24} />
<X size={24} />
<Search size={20} className="text-gray-500" />
```

## Quick Fix Approach

You have two options:

### Option 1: Gradual Migration (Recommended)
1. Install temporary compatibility packages to get the app running
2. Migrate components one by one over time
3. Remove compatibility packages when done

```bash
npm install react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled
```

This will get your app running immediately while you gradually update components.

### Option 2: Bulk Migration (More Work Upfront)
Update all components now using the patterns above.

## Recommended Next Steps

1. **Quick Start (Get it running):**
   ```bash
   # Install compatibility packages temporarily
   npm install react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled

   # Run dev server
   npm run dev
   ```

2. **Then Migrate Gradually:**
   - Start with high-traffic pages (Home, SignIn, SignUp)
   - Move to less critical components
   - Test each component after migration
   - Remove compatibility packages when all done

3. **Use Migration Helpers:**
   - See [TAILWIND_MIGRATION.md](TAILWIND_MIGRATION.md) for MUI → Tailwind patterns
   - Use `cn()` utility from `@/lib/utils` for conditional classes

## Component-Specific Notes

### Header/Sidebar (Critical - Fix First)
These are used on every page via the main layout. Priority fix!

### Forms (SignIn/SignUp)
- Replace `TextField` with `<input>` + Tailwind
- Replace `Button` with `<button>` + Tailwind
- Keep validation logic, just change UI

### Navigation Components
- Replace `<Link to=...>` with `<Link href=...>`
- Replace `navigate()` with `router.push()`

## Testing Checklist

After migrating each component:
- [ ] Component renders without errors
- [ ] Navigation works (links, buttons)
- [ ] Styling looks correct
- [ ] Mobile responsive
- [ ] No console warnings

## Need Help?

See these guides:
- [TAILWIND_MIGRATION.md](TAILWIND_MIGRATION.md) - Tailwind patterns
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Next.js migration
- [Lucide Icons](https://lucide.dev) - Icon replacements

---

**TL;DR:** Run `npm install react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled` to get the app working now, then migrate components gradually using the patterns above.
