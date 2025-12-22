# Tailwind CSS Migration

## Overview

The project has been migrated from Material-UI (MUI) to **Tailwind CSS 3.4** for a lighter, more customizable styling solution.

## What Changed

### Removed
- ❌ `@mui/material`
- ❌ `@mui/icons-material`
- ❌ `@mui/lab`
- ❌ `@mui/x-data-grid`
- ❌ `@emotion/react`
- ❌ `@emotion/styled`

### Added
- ✅ `tailwindcss` (v3.4.17)
- ✅ `autoprefixer` (v10.4.20)
- ✅ `postcss` (v8.4.49)
- ✅ `lucide-react` (v0.454.0) - Modern icon library
- ✅ `clsx` (v2.1.1) - Conditional classes
- ✅ `tailwind-merge` (v2.5.5) - Merge Tailwind classes

## Configuration Files

### [tailwind.config.js](tailwind.config.js)
```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './client/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'rgb(210, 193, 156)',
        'border-dark': '#2d2f2f',
        'border-light': '#eaeaea',
        'bg-dark': 'rgb(22, 24, 25)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  darkMode: 'media', // Uses system preference
}
```

### [postcss.config.js](postcss.config.js)
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Using Tailwind CSS

### Basic Usage

```javascript
// Instead of MUI components
import { Box, Button } from '@mui/material'

// Use native HTML with Tailwind
<div className="flex items-center justify-center p-4">
  <button className="bg-accent text-white px-4 py-2 rounded hover:opacity-80">
    Click me
  </button>
</div>
```

### Conditional Classes with clsx

```javascript
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)}>
  Content
</div>
```

### Icons with Lucide React

```javascript
// Instead of MUI icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

// Use Lucide icons
import { ChevronUp, Menu, X, Search } from 'lucide-react'

<ChevronUp size={24} className="text-accent" />
<Menu size={20} />
<Search className="w-5 h-5" />
```

## Common Component Patterns

### Old MUI Patterns → New Tailwind Patterns

#### Box Component
```javascript
// Before (MUI)
<Box sx={{ padding: 2, margin: 1, display: 'flex' }}>

// After (Tailwind)
<div className="p-8 m-4 flex">
```

#### Button Component
```javascript
// Before (MUI)
<Button variant="contained" color="primary">

// After (Tailwind)
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
```

#### Grid/Flexbox Layout
```javascript
// Before (MUI)
<Box display="flex" justifyContent="space-between" alignItems="center">

// After (Tailwind)
<div className="flex justify-between items-center">
```

#### Backdrop/Modal
```javascript
// Before (MUI)
<Backdrop open={open} onClick={handleClose}>
  <img src={image} />
</Backdrop>

// After (Tailwind)
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
  <img src={image} className="max-h-full" />
</div>
```

## Utility Function

Use the `cn()` utility to merge Tailwind classes:

```javascript
import { cn } from '@/lib/utils'

// Merges and deduplicates classes
const buttonClasses = cn(
  'px-4 py-2 rounded',
  'hover:bg-accent',
  isDisabled && 'opacity-50 cursor-not-allowed',
  className // Accept additional classes from props
)

<button className={buttonClasses}>
```

## Color Palette

Custom colors from your design system:

```javascript
// Tailwind classes
className="bg-accent"           // rgb(210, 193, 156) - Your accent color
className="border-border-dark"  // #2d2f2f
className="border-border-light" // #eaeaea
className="bg-bg-dark"          // rgb(22, 24, 25)

// Or use CSS variables (still available)
className="bg-[var(--accent-color)]"
```

## Dark Mode

Tailwind uses system preference:

```javascript
// Light mode: default styles
// Dark mode: use dark: prefix
<div className="bg-white dark:bg-bg-dark text-black dark:text-white">
```

## Responsive Design

```javascript
<div className="
  w-full           /* Mobile: full width */
  md:w-1/2         /* Tablet: half width */
  lg:w-1/3         /* Desktop: third width */
  p-4              /* All: padding */
  md:p-8           /* Tablet+: more padding */
">
```

## Migration Checklist

When updating components from MUI to Tailwind:

- [ ] Replace `<Box>` with `<div>`
- [ ] Replace `<Button>` with `<button>` + Tailwind classes
- [ ] Replace `<Typography>` with semantic HTML (`<h1>`, `<p>`, etc.)
- [ ] Replace MUI icons with Lucide React icons
- [ ] Convert `sx` props to `className` with Tailwind
- [ ] Replace `<Stack>`, `<Grid>` with Flexbox/Grid classes
- [ ] Update form components (TextField → input + Tailwind)
- [ ] Test responsive behavior

## Example Component Migration

### Before (MUI):
```javascript
import { Box, Button, Typography } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

function BackToTop({ show }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: 40,
        bottom: 40,
        borderRadius: '50%',
        width: 55,
        height: 55,
        display: show ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <KeyboardArrowUpIcon sx={{ fontSize: 35 }} />
    </Box>
  )
}
```

### After (Tailwind):
```javascript
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

function BackToTop({ show }) {
  return (
    <div
      className={cn(
        'fixed right-10 bottom-10 rounded-full w-14 h-14',
        'flex items-center justify-center',
        'bg-accent hover:shadow-lg transition-all',
        !show && 'hidden'
      )}
    >
      <ChevronUp size={35} />
    </div>
  )
}
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://tailwindcomponents.com/cheatsheet/)
- [Lucide Icons](https://lucide.dev/icons/)
- [Headless UI](https://headlessui.com/) - For complex components (modals, dropdowns)

## Tips

1. **Use the cn() utility** for conditional classes
2. **Install Tailwind CSS IntelliSense** extension in VS Code
3. **Use arbitrary values** when needed: `className="top-[117px]"`
4. **Extract repeated patterns** into components
5. **Consider Headless UI** for complex interactive components

## Common Tailwind Classes

### Layout
- `flex`, `grid`, `block`, `inline-block`
- `container`, `mx-auto`
- `hidden`, `md:block`

### Spacing
- `p-4`, `px-4`, `py-2`, `m-4`, `mt-2`
- `space-x-4`, `gap-4`

### Colors
- `bg-blue-500`, `text-white`, `border-gray-300`
- `hover:bg-blue-600`, `focus:ring-2`

### Typography
- `text-sm`, `text-lg`, `font-bold`, `font-semibold`
- `text-center`, `text-left`

### Sizing
- `w-full`, `h-screen`, `max-w-md`, `min-h-0`

### Positioning
- `relative`, `absolute`, `fixed`
- `top-0`, `right-4`, `inset-0`

### Effects
- `shadow-lg`, `rounded`, `rounded-full`
- `opacity-50`, `transition-all`
