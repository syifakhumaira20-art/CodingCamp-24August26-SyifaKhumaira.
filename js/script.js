/* ============================================
   DAYBOOK — Life Dashboard
   Vanilla JS. All data persisted in localStorage.
   ============================================ */

/* ---------- Storage keys ---------- */
const STORAGE_KEYS = {
  tasks: 'daybook_tasks',
  links: 'daybook_links',
  name: 'daybook_username',
  theme: 'daybook_theme',
  timerLength: 'daybook_timer_length'
};

/* ============================================
   1. GREETING — live clock, date, name, theme
   ============================================ */
const dateDisplay = document.getElementById('dateDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const greetingText = document.getElementById('greetingText');
const userNameDisplay = document.getElementById('userNameDisplay');
const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');

function getGreetingWord(hour) {
  if (hour < 5) return 'Burning the midnight oil';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function updateClock() {
  const now = new Date();

  dateDisplay.textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  timeDisplay.textContent = now.toLocaleTimeString(undefined, { hour12: false });

  const savedName = localStorage.getItem(STORAGE_KEYS.name);
  const greetingWord = getGreetingWord(now.getHours());
  greetingText.firstChild.textContent = greetingWord;
  userNameDisplay.textContent = savedName ? `, ${savedName}` : '';
}

function loadName() {
  const savedName = localStorage.getItem(STORAGE_KEYS.name);
  if (savedName) nameInput.value = savedName;
}

nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = nameInput.value.trim();
  if (value) {
    localStorage.setItem(STORAGE_KEYS.name, value);
  } else {
    localStorage.removeItem(STORAGE_KEYS.name);
  }
  updateClock();
});

updateClock();
setInterval(updateClock, 1000);
loadName();

/* ---------- Challenge: Light / Dark mode ---------- */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.textContent = '☾';
  }
}

function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(STORAGE_KEYS.theme, next);
});

loadTheme();

/* ============================================
   2. FOCUS TIMER — 25 min default, adjustable
   ============================================ */
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const timerStatus = document.getElementById('timerStatus');
const timerLengthSelect = document.getElementById('timerLength');

let timerIntervalId = null;
let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(remainingSeconds);
}

function loadTimerLength() {
  const saved = localStorage.getItem(STORAGE_KEYS.timerLength);
  const minutes = saved ? parseInt(saved, 10) : 25;
  timerLengthSelect.value = minutes.toString();
  totalSeconds = minutes * 60;
  remainingSeconds = totalSeconds;
  renderTimer();
}

/* Challenge: change Pomodoro length */
timerLengthSelect.addEventListener('change', () => {
  const minutes = parseInt(timerLengthSelect.value, 10);
  localStorage.setItem(STORAGE_KEYS.timerLength, minutes.toString());
  totalSeconds = minutes * 60;
  remainingSeconds = totalSeconds;
  renderTimer();
  timerStatus.textContent = 'Ready when you are.';
});

function startTimer() {
  if (timerIntervalId) return;
  if (remainingSeconds <= 0) remainingSeconds = totalSeconds;

  startBtn.disabled = true;
  stopBtn.disabled = false;
  timerLengthSelect.disabled = true;
  timerStatus.textContent = 'Focus session running…';

  timerIntervalId = setInterval(() => {
    remainingSeconds--;
    renderTimer();
    if (remainingSeconds <= 0) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
      startBtn.disabled = false;
      stopBtn.disabled = true;
      timerLengthSelect.disabled = false;
      timerStatus.textContent = "Time's up — take a break!";
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerIntervalId);
  timerIntervalId = null;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  timerLengthSelect.disabled = false;
  timerStatus.textContent = 'Paused.';
}

function resetTimer() {
  clearInterval(timerIntervalId);
  timerIntervalId = null;
  remainingSeconds = totalSeconds;
  renderTimer();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  timerLengthSelect.disabled = false;
  timerStatus.textContent = 'Ready when you are.';
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

loadTimerLength();

/* ============================================
   3. TO-DO LIST — add, edit, done, delete,
      prevent duplicates, filter, sort
   ============================================ */
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const todoEmptyState = document.getElementById('todoEmptyState');
const todoCount = document.getElementById('todoCount');
const todoDuplicateWarning = document.getElementById('todoDuplicateWarning');
const todoFilter = document.getElementById('todoFilter');
const todoSort = document.getElementById('todoSort');

let tasks = [];
let duplicateWarningTimer = null;

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEYS.tasks);
  tasks = saved ? JSON.parse(saved) : [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

/* --- Challenge: Prevent duplicate tasks --- */
function showDuplicateWarning(text) {
  clearTimeout(duplicateWarningTimer);
  todoDuplicateWarning.textContent = `"${text}" is already on your list.`;
  todoDuplicateWarning.classList.add('visible');
  duplicateWarningTimer = setTimeout(() => {
    todoDuplicateWarning.classList.remove('visible');
  }, 3000);
}

/* --- Challenge: Sort tasks --- */
function getFilteredSortedTasks() {
  const filter = todoFilter.value;
  const sort = todoSort.value;

  // 1. Filter
  let result = tasks.filter((t) => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  // 2. Sort
  if (sort === 'az') {
    result = [...result].sort((a, b) => a.text.localeCompare(b.text));
  } else if (sort === 'za') {
    result = [...result].sort((a, b) => b.text.localeCompare(a.text));
  } else if (sort === 'active-first') {
    result = [...result].sort((a, b) => Number(a.done) - Number(b.done));
  } else if (sort === 'done-first') {
    result = [...result].sort((a, b) => Number(b.done) - Number(a.done));
  }
  // 'default' keeps insertion order

  return result;
}

function renderTasks() {
  todoList.innerHTML = '';

  const visible = getFilteredSortedTasks();

  // Empty state: distinguish "no tasks at all" from "filter hides everything"
  if (tasks.length === 0) {
    todoEmptyState.textContent = 'Nothing on your list yet — add your first task above.';
    todoEmptyState.style.display = 'block';
  } else if (visible.length === 0) {
    todoEmptyState.textContent = 'No tasks match this filter.';
    todoEmptyState.style.display = 'block';
  } else {
    todoEmptyState.style.display = 'none';
  }

  visible.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.done ? ' done' : '');
    li.dataset.id = task.id;

    const checkBtn = document.createElement('button');
    checkBtn.className = 'todo-check';
    checkBtn.setAttribute('aria-label', task.done ? 'Mark task active' : 'Mark task done');
    checkBtn.textContent = task.done ? '✓' : '';
    checkBtn.addEventListener('click', () => toggleDone(task.id));

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = task.text;
    textSpan.title = 'Double-click to edit';
    textSpan.addEventListener('dblclick', () => startEdit(task.id, textSpan));

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.textContent = '✏️';
    editBtn.addEventListener('click', () => startEdit(task.id, textSpan));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '🗑️';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.append(editBtn, deleteBtn);
    li.append(checkBtn, textSpan, actions);
    todoList.appendChild(li);
  });

  const doneCount = tasks.filter((t) => t.done).length;
  todoCount.textContent = tasks.length
    ? `${doneCount} of ${tasks.length} task${tasks.length === 1 ? '' : 's'} done`
    : '';
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  // Challenge: prevent duplicate tasks
  const isDuplicate = tasks.some((t) => t.text.toLowerCase() === trimmed.toLowerCase());
  if (isDuplicate) {
    showDuplicateWarning(trimmed);
    return;
  }

  tasks.push({ id: Date.now().toString(), text: trimmed, done: false });
  saveTasks();
  renderTasks();
}

function toggleDone(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

function startEdit(id, textSpan) {
  textSpan.contentEditable = 'true';
  textSpan.focus();

  const range = document.createRange();
  range.selectNodeContents(textSpan);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  function finishEdit() {
    textSpan.contentEditable = 'false';
    const newText = textSpan.textContent.trim();
    const task = tasks.find((t) => t.id === id);
    if (task && newText) {
      // Prevent duplicate on edit — revert if it clashes with another task
      const clash = tasks.some(
        (t) => t.id !== id && t.text.toLowerCase() === newText.toLowerCase()
      );
      if (clash) {
        showDuplicateWarning(newText);
        textSpan.textContent = task.text; // revert
      } else {
        task.text = newText;
        saveTasks();
        renderTasks();
      }
    } else if (task) {
      textSpan.textContent = task.text; // revert empty edit
    }
    textSpan.removeEventListener('blur', finishEdit);
    textSpan.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      textSpan.blur();
    }
    if (e.key === 'Escape') {
      textSpan.textContent = tasks.find((t) => t.id === id)?.text ?? '';
      textSpan.removeEventListener('blur', finishEdit);
      textSpan.removeEventListener('keydown', onKeyDown);
      textSpan.contentEditable = 'false';
    }
  }

  textSpan.addEventListener('blur', finishEdit);
  textSpan.addEventListener('keydown', onKeyDown);
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(todoInput.value);
  todoInput.value = '';
  todoInput.focus();
});

todoFilter.addEventListener('change', renderTasks);
todoSort.addEventListener('change', renderTasks);

loadTasks();
renderTasks();

/* ============================================
   4. QUICK LINKS — add, open, remove
   ============================================ */
const linksGrid = document.getElementById('linksGrid');
const linkForm = document.getElementById('linkForm');
const linkNameInput = document.getElementById('linkNameInput');
const linkUrlInput = document.getElementById('linkUrlInput');

const DEFAULT_LINKS = [
  { name: 'Gmail', url: 'https://mail.google.com' },
  { name: 'Calendar', url: 'https://calendar.google.com' },
  { name: 'Drive', url: 'https://drive.google.com' },
  { name: 'YouTube', url: 'https://youtube.com' }
];

let links = [];

function loadLinks() {
  const saved = localStorage.getItem(STORAGE_KEYS.links);
  links = saved ? JSON.parse(saved) : DEFAULT_LINKS.slice();
  if (!saved) saveLinks();
}

function saveLinks() {
  localStorage.setItem(STORAGE_KEYS.links, JSON.stringify(links));
}

function renderLinks() {
  linksGrid.innerHTML = '';

  links.forEach((link, index) => {
    const a = document.createElement('a');
    a.className = 'link-btn';
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    const icon = document.createElement('span');
    icon.className = 'link-favicon';
    icon.textContent = link.name.charAt(0).toUpperCase();

    const removeBtn = document.createElement('button');
    removeBtn.className = 'link-remove';
    removeBtn.setAttribute('aria-label', `Remove ${link.name}`);
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      links.splice(index, 1);
      saveLinks();
      renderLinks();
    });

    const label = document.createElement('span');
    label.textContent = link.name;

    a.append(icon, label, removeBtn);
    linksGrid.appendChild(a);
  });
}

function normalizeUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

linkForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = linkNameInput.value.trim();
  const url = normalizeUrl(linkUrlInput.value);
  if (!name || !url) return;

  links.push({ name, url });
  saveLinks();
  renderLinks();

  linkNameInput.value = '';
  linkUrlInput.value = '';
});

loadLinks();
renderLinks();
