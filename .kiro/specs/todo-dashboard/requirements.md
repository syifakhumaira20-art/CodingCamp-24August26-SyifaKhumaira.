# Requirements — To-Do List Life Dashboard

## Overview
A single-page, client-side dashboard that helps a user organize their day:
current time/greeting, a 25-minute focus timer, a to-do list, and quick
links to favorite sites. No backend; all data persists in the browser's
Local Storage.

## Functional Requirements

1. **Greeting**
   - Display the current date and a live-updating clock (HH:MM:SS).
   - Show a greeting that changes based on time of day (morning/afternoon/
     evening/night).
   - Allow the user to set a custom name that personalizes the greeting.

2. **Focus Timer**
   - Default 25-minute countdown timer.
   - Start, Stop (pause), and Reset controls.
   - User can change the session length (15/25/45/60 min); choice persists.

3. **To-Do List**
   - Add a task via a text input + submit.
   - Mark a task as done/undone via a checkbox-style control.
   - Edit a task's text in place (double-click or edit icon).
   - Delete a task.
   - All tasks persist in Local Storage across page reloads.

4. **Quick Links**
   - Buttons/tiles that open favorite websites in a new tab.
   - User can add new links (name + URL) and remove existing ones.
   - Links persist in Local Storage.

## Non-Functional Requirements
- Clean, minimal, readable interface with clear visual hierarchy.
- Fast load, no noticeable lag on interaction.
- Works in modern evergreen browsers (Chrome, Firefox, Edge, Safari).
- No build step, no frameworks — HTML, CSS, vanilla JS only.

## Technical Constraints
- 1 CSS file in `css/`, 1 JS file in `js/`.
- Local Storage only, no server/backend.

## Challenges Implemented (3 of 5)
- ✅ Light / Dark mode toggle
- ✅ Custom name in greeting
- ✅ Adjustable Pomodoro/focus session length
- ⬜ Prevent duplicate tasks (not implemented — noted as an extension point
  in `js/script.js`)
- ⬜ Sort tasks (not implemented)
