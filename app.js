// Select elements
const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const allTasksBtn = document.getElementById("allTasksBtn");
const activeTasksBtn = document.getElementById("activeTasksBtn");
const completedTasksBtn = document.getElementById("completedTasksBtn");
const searchInput = document.getElementById("searchInput");
const clearSortsBtn = document.getElementById("clearSortsBtn");

// Function to save tasks to local storage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll(".task-item").forEach((taskItem) => {
    const taskText = taskItem.querySelector(".task-text").textContent;
    const dueDate = taskItem.querySelector(".task-due-date").textContent;
    const priority = taskItem.querySelector(".task-priority").textContent;
    const isCompleted = taskItem.querySelector(
      'input[type="checkbox"]'
    ).checked;
    tasks.push({ text: taskText, dueDate, priority, completed: isCompleted });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const taskElement = createTaskElement(
      task.text,
      task.dueDate,
      task.priority,
      task.completed
    );
    taskList.appendChild(taskElement);
  });
}

// Function to create a task item element
function createTaskElement(taskText, dueDate, priority, isCompleted = false) {
  const li = document.createElement("li");
  li.classList.add(
    "task-item",
    "py-2",
    "border-b",
    "flex",
    "justify-between",
    "items-center"
  );

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted;
  checkbox.classList.add("mr-2");
  checkbox.addEventListener("change", () => {
    taskTextNode.classList.toggle("line-through", checkbox.checked);
    saveTasks();
  });
  li.appendChild(checkbox);

  const taskDetailsDiv = document.createElement("div");
  taskDetailsDiv.classList.add("task-details", "flex", "flex-col");

  const taskTextNode = document.createElement("span");
  taskTextNode.textContent = taskText;
  taskTextNode.classList.add("task-text");
  if (isCompleted) {
    taskTextNode.classList.add("line-through");
  }
  taskDetailsDiv.appendChild(taskTextNode);

  const taskDueDateNode = document.createElement("span");
  taskDueDateNode.textContent = dueDate;
  taskDueDateNode.classList.add("task-due-date", "text-sm", "text-gray-500");
  taskDetailsDiv.appendChild(taskDueDateNode);

  const taskPriorityNode = document.createElement("span");
  taskPriorityNode.textContent = priority;
  taskPriorityNode.classList.add("task-priority", "text-sm", "text-gray-500");
  taskDetailsDiv.appendChild(taskPriorityNode);

  li.appendChild(taskDetailsDiv);

  const buttonsDiv = document.createElement("div");

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add(
    "bg-yellow-500",
    "text-white",
    "px-2",
    "py-1",
    "rounded",
    "mr-2"
  );
  editBtn.addEventListener("click", () =>
    editTask(taskTextNode, taskDueDateNode, taskPriorityNode)
  );
  buttonsDiv.appendChild(editBtn);

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add(
    "bg-red-500",
    "text-white",
    "px-2",
    "py-1",
    "rounded"
  );
  deleteBtn.addEventListener("click", () => deleteTask(li));
  buttonsDiv.appendChild(deleteBtn);

  li.appendChild(buttonsDiv);

  return li;
}

// Function to add a task
function addTask() {
  const taskText = taskInput.value;
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (taskText.trim() !== "") {
    const taskElement = createTaskElement(taskText, dueDate, priority);
    taskList.appendChild(taskElement);
    taskInput.value = "";
    dueDateInput.value = "";
    priorityInput.value = "";
    saveTasks();
  }
}

// Function to edit a task
function editTask(taskTextNode, taskDueDateNode, taskPriorityNode) {
  const newText = prompt("Edit your task:", taskTextNode.textContent);
  const newDueDate = prompt("Edit your due date:", taskDueDateNode.textContent);
  const newPriority = prompt(
    "Edit your priority:",
    taskPriorityNode.textContent
  );

  if (newText !== null && newText.trim() !== "") {
    taskTextNode.textContent = newText;
  }
  if (newDueDate !== null && newDueDate.trim() !== "") {
    taskDueDateNode.textContent = newDueDate;
  }
  if (newPriority !== null && newPriority.trim() !== "") {
    taskPriorityNode.textContent = newPriority;
  }

  saveTasks();
}

// Function to delete a task
function deleteTask(taskElement) {
  taskList.removeChild(taskElement);
  saveTasks();
}

// Function to filter tasks
function filterTasks(filter) {
  const taskItems = taskList.querySelectorAll(".task-item");
  taskItems.forEach((taskItem) => {
    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    switch (filter) {
      case "all":
        taskItem.style.display = "flex";
        break;
      case "active":
        taskItem.style.display = checkbox.checked ? "none" : "flex";
        break;
      case "completed":
        taskItem.style.display = checkbox.checked ? "flex" : "none";
        break;
    }
  });
}

// Function to search tasks
function searchTasks() {
  const searchText = searchInput.value.toLowerCase();
  const taskItems = taskList.querySelectorAll(".task-item");
  taskItems.forEach((taskItem) => {
    const taskText = taskItem
      .querySelector(".task-text")
      .textContent.toLowerCase();
    if (taskText.includes(searchText)) {
      taskItem.style.display = "flex";
    } else {
      taskItem.style.display = "none";
    }
  });
}

// Function to clear filters and sorts
function clearFiltersAndSorts() {
  searchInput.value = "";
  filterTasks("all");
  loadTasks();
}

// Function to sort tasks by due date
function sortTasksByDueDate() {
  const tasks = Array.from(taskList.querySelectorAll(".task-item"));
  tasks.sort((a, b) => {
    const dueDateA = new Date(a.querySelector(".task-due-date").textContent);
    const dueDateB = new Date(b.querySelector(".task-due-date").textContent);
    return dueDateA - dueDateB;
  });
  taskList.innerHTML = "";
  tasks.forEach((task) => taskList.appendChild(task));
}

// Function to sort tasks by priority
function sortTasksByPriority() {
  const priorityLevels = { low: 3, medium: 2, high: 1 };
  const tasks = Array.from(taskList.querySelectorAll(".task-item"));
  tasks.sort((a, b) => {
    const priorityA =
      priorityLevels[
        a.querySelector(".task-priority").textContent.toLowerCase()
      ];
    const priorityB =
      priorityLevels[
        b.querySelector(".task-priority").textContent.toLowerCase()
      ];
    return priorityA - priorityB;
  });
  taskList.innerHTML = "";
  tasks.forEach((task) => taskList.appendChild(task));
}

// Event listeners for filter buttons
allTasksBtn.addEventListener("click", () => filterTasks("all"));
activeTasksBtn.addEventListener("click", () => filterTasks("active"));
completedTasksBtn.addEventListener("click", () => filterTasks("completed"));

// Event listener for the search input
searchInput.addEventListener("input", searchTasks);

// Event listener for the add task button
addTaskBtn.addEventListener("click", addTask);

// Event listener for clear filters/sorts button
clearSortsBtn.addEventListener("click", clearFiltersAndSorts);

// Allow pressing Enter to add a task
taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Load tasks when the page loads
window.addEventListener("load", loadTasks);
