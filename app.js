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
const sortDueDateBtn = document.getElementById("sortDueDateBtn");
const sortPriorityBtn = document.getElementById("sortPriorityBtn");

// Function to save tasks to local storage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll(".task-item").forEach((taskItem) => {
    const taskText = taskItem.querySelector(".task-text").textContent;
    const dueDate = taskItem
      .querySelector(".task-due-date")
      .textContent.replace("Due: ", "");
    const priority = taskItem
      .querySelector(".task-priority")
      .textContent.replace("Priority: ", "");
    const isCompleted = taskItem.querySelector(
      'input[type="checkbox"]'
    ).checked;
    tasks.push({
      text: taskText,
      dueDate: dueDate,
      priority: priority,
      completed: isCompleted,
    });
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

  const taskDetails = document.createElement("div");
  taskDetails.classList.add("flex-grow");

  const taskTextNode = document.createElement("span");
  taskTextNode.textContent = taskText;
  taskTextNode.classList.add("task-text");
  if (isCompleted) {
    taskTextNode.classList.add("line-through");
  }
  taskDetails.appendChild(taskTextNode);

  const dueDateNode = document.createElement("div");
  dueDateNode.textContent = dueDate ? `Due: ${dueDate}` : "";
  dueDateNode.classList.add("task-due-date", "text-sm", "text-gray-500");
  taskDetails.appendChild(dueDateNode);

  const priorityNode = document.createElement("div");
  priorityNode.textContent = priority ? `Priority: ${priority}` : "";
  priorityNode.classList.add("task-priority", "text-sm", "text-gray-500");
  taskDetails.appendChild(priorityNode);

  li.appendChild(taskDetails);

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
    editTask(taskTextNode, dueDateNode, priorityNode)
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
function editTask(taskTextNode, dueDateNode, priorityNode) {
  const newText = prompt("Edit your task:", taskTextNode.textContent);
  const newDueDate = prompt(
    "Edit due date (YYYY-MM-DD):",
    dueDateNode.textContent.replace("Due: ", "")
  );
  const newPriority = prompt(
    "Edit priority (high, medium, low):",
    priorityNode.textContent.replace("Priority: ", "")
  );
  if (newText !== null && newText.trim() !== "") {
    taskTextNode.textContent = newText;
    dueDateNode.textContent = newDueDate ? `Due: ${newDueDate}` : "";
    priorityNode.textContent = newPriority ? `Priority: ${newPriority}` : "";
    saveTasks();
  }
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

// Function to sort tasks by due date
function sortTasksByDueDate() {
  const taskItems = Array.from(taskList.querySelectorAll(".task-item"));
  taskItems.sort((a, b) => {
    const aDueDate = new Date(
      a.querySelector(".task-due-date").textContent.replace("Due: ", "")
    ).getTime();
    const bDueDate = new Date(
      b.querySelector(".task-due-date").textContent.replace("Due: ", "")
    ).getTime();
    return aDueDate - bDueDate;
  });
  taskList.innerHTML = "";
  taskItems.forEach((taskItem) => taskList.appendChild(taskItem));
}

// Function to sort tasks by priority
function sortTasksByPriority() {
  const taskItems = Array.from(taskList.querySelectorAll(".task-item"));
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  taskItems.sort((a, b) => {
    const aPriority = a
      .querySelector(".task-priority")
      .textContent.replace("Priority: ", "")
      .toLowerCase();
    const bPriority = b
      .querySelector(".task-priority")
      .textContent.replace("Priority: ", "")
      .toLowerCase();
    return priorityOrder[aPriority] - priorityOrder[bPriority];
  });
  taskList.innerHTML = "";
  taskItems.forEach((taskItem) => taskList.appendChild(taskItem));
}

// Event listeners for filter buttons
allTasksBtn.addEventListener("click", () => filterTasks("all"));
activeTasksBtn.addEventListener("click", () => filterTasks("active"));
completedTasksBtn.addEventListener("click", () => filterTasks("completed"));

// Event listener for the search input
searchInput.addEventListener("input", searchTasks);

// Event listener for the add task button
addTaskBtn.addEventListener("click", addTask);

// Event listeners for sorting buttons
sortDueDateBtn.addEventListener("click", sortTasksByDueDate);
sortPriorityBtn.addEventListener("click", sortTasksByPriority);

// Allow pressing Enter to add a task
taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Load tasks when the page loads
window.addEventListener("load", loadTasks);
