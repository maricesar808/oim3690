const form = document.querySelector("#todo-form");
const taskInput = document.querySelector("#task-input");
const dueDateInput = document.querySelector("#due-date");
const todoList = document.querySelector("#todo-list");
const taskCount = document.querySelector("#task-count");
const clearAllButton = document.querySelector("#clear-all");
const storageKey = "simple-todo-items";

let todos = loadTodos();

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}

function formatDueDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function isOverdue(todo) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !todo.completed && new Date(`${todo.dueDate}T00:00:00`) < today;
}

function renderTodos() {
  todoList.replaceChildren();

  if (todos.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "No tasks yet. Add one above!";
    todoList.append(emptyState);
  } else {
    const sortedTodos = [...todos].sort((a, b) =>
      a.completed - b.completed || a.dueDate.localeCompare(b.dueDate)
    );

    sortedTodos.forEach((todo) => {
      const item = document.createElement("li");
      item.className = "todo-item";
      item.dataset.id = todo.id;

      if (todo.completed) item.classList.add("completed");
      if (isOverdue(todo)) item.classList.add("overdue");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.setAttribute("aria-label", `Mark ${todo.text} as complete`);

      const details = document.createElement("div");
      const name = document.createElement("span");
      const dueDate = document.createElement("span");

      name.className = "task-name";
      name.textContent = todo.text;
      dueDate.className = "due-date";
      dueDate.textContent = `${isOverdue(todo) ? "Overdue · " : "Due "}${formatDueDate(todo.dueDate)}`;

      details.append(name, dueDate);

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.type = "button";
      deleteButton.textContent = "✕";
      deleteButton.setAttribute("aria-label", `Delete ${todo.text}`);

      item.append(checkbox, details, deleteButton);
      todoList.append(item);
    });
  }

  const remaining = todos.filter((todo) => !todo.completed).length;
  taskCount.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} remaining`;
  clearAllButton.disabled = todos.length === 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!text || !dueDate) return;

  todos.push({
    id: crypto.randomUUID(),
    text,
    dueDate,
    completed: false
  });

  saveTodos();
  renderTodos();
  form.reset();
  taskInput.focus();
});

todoList.addEventListener("change", (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;

  const id = event.target.closest(".todo-item").dataset.id;
  const todo = todos.find((item) => item.id === id);
  todo.completed = event.target.checked;
  saveTodos();
  renderTodos();
});

todoList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-button");
  if (!deleteButton) return;

  const id = deleteButton.closest(".todo-item").dataset.id;
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
});

clearAllButton.addEventListener("click", () => {
  if (todos.length > 0 && window.confirm("Delete all tasks?")) {
    todos = [];
    saveTodos();
    renderTodos();
  }
});

renderTodos();
