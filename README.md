# Daybook — To-Do List Life Dashboard

A single-page life dashboard: live greeting/clock, a 25-minute focus timer,
a to-do list, and quick links — all saved locally in your browser.

## Run it locally
No build step needed. Just open `index.html` in a browser, or for a proper
local server (recommended, avoids any file:// quirks):

```
cd todo-dashboard
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Folder structure
```
todo-dashboard/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── .kiro/
│   └── specs/todo-dashboard/   (requirements, design, tasks)
└── README.md
```

## Challenges implemented (3 of 5)
- Light / Dark mode toggle
- Custom name in greeting
- Adjustable focus/Pomodoro session length

## Deploying with GitHub Pages
1. In GitHub Desktop: File → Add Local Repository → select this folder.
2. Publish repository (name it `CodingCamp-24August26-yourname`).
3. On GitHub.com → repo → Settings → Pages → Source: `main` branch, `/root`.
4. Your live URL will be `https://yourusername.github.io/repo-name/`.

## Submission checklist
- [ ] Repo pushed to GitHub, including the `.kiro` folder
- [ ] Site published via GitHub Pages and loads correctly
- [ ] AWS/Kiro Builder ID, repo URL, and live site URL submitted via Paperform
