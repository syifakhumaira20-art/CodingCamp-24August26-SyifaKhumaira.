# Design — To-Do List Life Dashboard

## Visual Direction
"Daybook" — a calm, paper-like morning workspace.
- **Palette:** soft blue-grey background (#EAEFF1 / #DCE4E8), deep teal for
  structure and primary actions (#2B6777), warm amber for the focus timer
  (#E8974A), evoking a rising sun marking the passage of time.
- **Type:** Fraunces (serif, display) for the greeting/timer numerals —
  gives the page a warm, human, "handwritten planner" feel — paired with
  Inter (sans) for UI text and body copy.
- **Layout:** greeting spans the full width at the top (it's the anchor of
  the page); timer and to-do list sit side by side below; quick links close
  out the page. Responsive to a single column on mobile.

## Architecture
- `index.html` — semantic sections per feature (greeting, timer, todo,
  links), no inline styles/scripts.
- `css/style.css` — CSS custom properties drive both light and dark themes
  (`[data-theme="dark"]` overrides the same variable set).
- `js/script.js` — organized into four independent modules (Greeting,
  Timer, To-Do, Quick Links), each reading/writing its own Local Storage
  key so features never interfere with each other.

## Data Model (Local Storage)
| Key                     | Shape                                   |
|--------------------------|------------------------------------------|
| `daybook_tasks`          | `[{ id, text, done }]`                   |
| `daybook_links`          | `[{ name, url }]`                        |
| `daybook_username`       | `string`                                 |
| `daybook_theme`          | `"light" \| "dark"`                      |
| `daybook_timer_length`   | `string` (minutes)                       |
