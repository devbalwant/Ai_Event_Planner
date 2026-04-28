# ✅ Complete Dark Mode Update Guide

## 🎨 Professional Dark Mode Colors

### Light Mode

- Background: `#E8DCC4` (Cream)
- Cards: `white`
- Text: `#8B1538` (Maroon)
- Accent: `#C4A574` (Gold)

### Dark Mode

- Background: `#0f0f0f` (Almost Black)
- Secondary BG: `#1a1a1a` (Dark Gray)
- Cards: `#242424` (Card Gray)
- Text: `#e5e5e5` (Light Gray)
- Secondary Text: `#a3a3a3` (Medium Gray)
- Borders: `#333333` (Dark Borders)
- Accent: `#C4A574` (Gold)

## 📝 Global Find & Replace Rules

Apply these replacements across ALL `.jsx` and `.tsx` files:

### Backgrounds

```
Find: dark:bg-[#5A0E24]
Replace: dark:bg-[#0f0f0f]

Find: dark:bg-[#8B1538]
Replace: dark:bg-[#242424]

Find: dark:bg-[#1f3329]
Replace: dark:bg-[#242424]

Find: dark:bg-[#1a2e22]
Replace: dark:bg-[#1a1a1a]
```

### Text Colors

```
Find: dark:text-[#E8DCC4]
Replace: dark:text-[#e5e5e5]

Find: dark:text-[#D4C8B0]
Replace: dark:text-[#a3a3a3]

Find: dark:text-white
Replace: dark:text-[#e5e5e5]
```

### Borders

```
Find: dark:border-[#C4A574]/20
Replace: dark:border-[#333333]

Find: dark:border-gray-700
Replace: dark:border-[#333333]
```

### Placeholders

```
Find: dark:placeholder:text-[#D4C8B0]/50
Replace: dark:placeholder:text-[#a3a3a3]
```

### Button Text

```
Find: text-[#5A0E24]
Replace: text-[#0f0f0f]

(For buttons with gold background)
```

## 🔧 Component-Specific Updates

### Navbar

```jsx
className =
  "bg-[#8B1538] dark:bg-[#1a1a1a] border-b border-[#C4A574]/20 dark:border-[#333333]";
```

### Sidebar

```jsx
className =
  "bg-[#8B1538] dark:bg-[#1a1a1a] border-r border-[#C4A574]/20 dark:border-[#333333]";
```

### Cards

```jsx
className =
  "bg-white dark:bg-[#242424] border border-[#C4A574]/20 dark:border-[#333333]";
```

### Page Backgrounds

```jsx
className = "min-h-screen bg-[#E8DCC4] dark:bg-[#0f0f0f]";
```

### Section Backgrounds (Alternating)

```jsx
// Primary sections
className = "bg-[#E8DCC4] dark:bg-[#0f0f0f]";

// Secondary sections
className = "bg-white dark:bg-[#1a1a1a]";
```

### Input Fields

```jsx
className="bg-white dark:bg-[#1a1a1a]
           border-[#C4A574]/30 dark:border-[#333333]
           text-[#8B1538] dark:text-[#e5e5e5]
           placeholder:text-[#8B1538]/40 dark:placeholder:text-[#a3a3a3]"
```

### Buttons

```jsx
// Primary Button
className="bg-[#C4A574] hover:bg-[#B09560] text-[#0f0f0f]"

// Secondary Button
className="border-[#E8DCC4] dark:border-[#C4A574]
           hover:bg-[#E8DCC4] dark:hover:bg-[#C4A574]
           text-[#E8DCC4] dark:text-[#C4A574]
           hover:text-[#8B1538] dark:hover:text-[#0f0f0f]"
```

## 📂 Files Updated

### ✅ Completed

1. src/App.css
2. src/pages/Home.jsx
3. src/pages/Login.jsx
4. src/pages/Register.jsx
5. src/components/Sidebar.jsx
6. DARK_MODE_COLORS.md
7. tailwind.config.js

### 🔄 Need Manual Update

Apply the find & replace rules above to these files:

**Attendee Pages:**

- src/pages/attendee/AttendeeDashboard.jsx
- src/pages/attendee/BrowseEvents.jsx
- src/pages/attendee/BookingPage.jsx

**Organizer Pages:**

- src/pages/organizer/OrganizerDashboard.jsx
- src/pages/organizer/CreateEvent.jsx
- src/pages/organizer/AIPlanner.jsx
- src/pages/organizer/GuestManagement.jsx
- src/pages/organizer/TaskChecklist.jsx

**Admin Pages:**

- src/pages/admin/AdminDashboard.jsx
- src/pages/admin/ManageOrganizers.jsx
- src/pages/admin/ManageEvents.jsx

**Components:**

- src/components/Navbar.jsx
- src/components/EventCard.jsx
- src/components/BookingCard.jsx

**Other:**

- src/pages/EventDetail.jsx

## 🚀 Quick Update Command

Use your editor's find & replace feature (Ctrl+Shift+H in VS Code) to apply all replacements at once:

1. Open "Find in Files" (Ctrl+Shift+F)
2. Set "files to include": `src/**/*.{jsx,tsx}`
3. Apply each find & replace from the list above
4. Review changes before saving

## ✨ Result

After applying all updates:

- ✅ Professional dark mode with proper contrast
- ✅ No more full maroon backgrounds in dark mode
- ✅ Consistent gold accents across both modes
- ✅ Easy to read text in both modes
- ✅ Beautiful transitions between modes

## 🎯 Testing

```bash
npm run dev
```

Toggle dark mode and verify:

1. Backgrounds are dark gray, not maroon
2. Text is readable with good contrast
3. Cards stand out from background
4. Buttons look good in both modes
5. Borders are visible but subtle
