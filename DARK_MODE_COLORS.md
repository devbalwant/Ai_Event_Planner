# Professional Dark Mode Color Scheme

## 🎨 Color Philosophy

### Light Mode (Maroon & Cream Theme)

- **Primary Background**: `#E8DCC4` (Cream)
- **Card Background**: `white`
- **Primary Text**: `#8B1538` (Maroon)
- **Accent**: `#C4A574` (Gold)

### Dark Mode (Professional Dark Theme)

- **Primary Background**: `#0f0f0f` (Almost Black)
- **Secondary Background**: `#1a1a1a` (Dark Gray)
- **Card Background**: `#242424` (Card Gray)
- **Primary Text**: `#e5e5e5` (Light Gray)
- **Secondary Text**: `#a3a3a3` (Medium Gray)
- **Accent**: `#C4A574` (Gold - Same as light mode)
- **Border**: `#333333` (Dark Border)

## 📋 Component-wise Color Mapping

### Backgrounds

```css
/* Main Page Background */
bg-[#E8DCC4] dark:bg-[#0f0f0f]

/* Section Backgrounds (Alternating) */
bg-white dark:bg-[#1a1a1a]
bg-[#E8DCC4] dark:bg-[#0f0f0f]

/* Card Backgrounds */
bg-white dark:bg-[#242424]

/* Navbar/Header */
bg-[#8B1538] dark:bg-[#1a1a1a]

/* Sidebar */
bg-[#8B1538] dark:bg-[#1a1a1a]
```

### Text Colors

```css
/* Primary Headings */
text-[#8B1538] dark:text-[#e5e5e5]

/* Secondary Text */
text-[#8B1538]/70 dark:text-[#a3a3a3]

/* Navbar Text */
text-[#E8DCC4] (same in both modes)

/* Muted Text */
text-[#D4C8B0] dark:text-[#a3a3a3]
```

### Buttons

```css
/* Primary Button */
bg-[#C4A574] hover:bg-[#B09560] text-[#0f0f0f]

/* Secondary Button (Outline) */
border-[#E8DCC4] dark:border-[#C4A574]
hover:bg-[#E8DCC4] dark:hover:bg-[#C4A574]
text-[#E8DCC4] dark:text-[#C4A574]
hover:text-[#8B1538] dark:hover:text-[#0f0f0f]
```

### Borders

```css
/* Card Borders */
border-[#C4A574]/20 dark:border-[#333333]

/* Input Borders */
border-[#C4A574]/30 dark:border-[#333333]

/* Dividers */
border-[#C4A574]/20 dark:border-[#333333]
```

### Interactive Elements

```css
/* Hover States */
hover:bg-[#C4A574]/20 dark:hover:bg-[#242424]

/* Active States */
bg-[#C4A574] text-[#0f0f0f]

/* Focus States */
focus:ring-[#C4A574]/40 focus:border-[#C4A574]
```

## 🔧 Implementation Rules

1. **Never use pure maroon in dark mode backgrounds** - Use dark grays instead
2. **Keep gold accent consistent** - `#C4A574` works in both modes
3. **Use proper contrast** - Light text on dark backgrounds
4. **Borders should be subtle** - `#333333` for dark mode
5. **Cards should stand out** - `#242424` on `#0f0f0f` background

## ✅ Good Examples

```jsx
// ✅ GOOD - Proper dark mode
<div className="bg-white dark:bg-[#242424]">
  <h1 className="text-[#8B1538] dark:text-[#e5e5e5]">Title</h1>
  <p className="text-[#8B1538]/70 dark:text-[#a3a3a3]">Description</p>
</div>

// ✅ GOOD - Button with proper contrast
<button className="bg-[#C4A574] hover:bg-[#B09560] text-[#0f0f0f]">
  Click Me
</button>
```

## ❌ Bad Examples

```jsx
// ❌ BAD - Using maroon in dark mode background
<div className="bg-[#E8DCC4] dark:bg-[#8B1538]">

// ❌ BAD - Poor contrast in dark mode
<p className="text-[#8B1538] dark:text-[#8B1538]">

// ❌ BAD - Button with poor dark mode contrast
<button className="bg-[#C4A574] text-[#5A0E24] dark:text-[#5A0E24]">
```

## 🎯 Quick Reference

| Element    | Light Mode   | Dark Mode |
| ---------- | ------------ | --------- |
| Page BG    | `#E8DCC4`    | `#0f0f0f` |
| Card BG    | `white`      | `#242424` |
| Navbar     | `#8B1538`    | `#1a1a1a` |
| Text       | `#8B1538`    | `#e5e5e5` |
| Muted Text | `#8B1538/70` | `#a3a3a3` |
| Border     | `#C4A574/20` | `#333333` |
| Accent     | `#C4A574`    | `#C4A574` |
