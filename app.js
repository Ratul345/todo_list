// app.js

// Select elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const allTasksBtn = document.getElementById("allTasksBtn");
const activeTasksBtn = document.getElementById("activeTasksBtn");
const completedTasksBtn = document.getElementById("completedTasksBtn");
const searchInput = document.getElementById("searchInput");

// Function to save tasks to local storage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll(".task-item").forEach((taskItem) => {
    const taskText = taskItem.querySelector("span").textContent;
    const isCompleted = taskItem.querySelector(
      'input[type="checkbox"]'
    ).checked;
    tasks.push({ text: taskText, completed: isCompleted });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const taskElement = createTaskElement(task.text, task.completed);
    taskList.appendChild(taskElement);
  });
}

// Function to create a task item element
function createTaskElement(taskText, isCompleted = false) {
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

  const taskTextNode = document.createElement("span");
  taskTextNode.textContent = taskText;
  if (isCompleted) {
    taskTextNode.classList.add("line-through");
  }
  li.appendChild(taskTextNode);

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
  editBtn.addEventListener("click", () => editTask(taskTextNode));
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
  if (taskText.trim() !== "") {
    const taskElement = createTaskElement(taskText);
    taskList.appendChild(taskElement);
    taskInput.value = "";
    saveTasks();
  }
}

// Function to edit a task
function editTask(taskTextNode) {
  const newText = prompt("Edit your task:", taskTextNode.textContent);
  if (newText !== null && newText.trim() !== "") {
    taskTextNode.textContent = newText;
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
    const taskText = taskItem.querySelector("span").textContent.toLowerCase();
    if (taskText.includes(searchText)) {
      taskItem.style.display = "flex";
    } else {
      taskItem.style.display = "none";
    }
  });
}

// Event listeners for filter buttons
allTasksBtn.addEventListener("click", () => filterTasks("all"));
activeTasksBtn.addEventListener("click", () => filterTasks("active"));
completedTasksBtn.addEventListener("click", () => filterTasks("completed"));

// Event listener for the search input
searchInput.addEventListener("input", searchTasks);

// Event listener for the add task button
addTaskBtn.addEventListener("click", addTask);

// Allow pressing Enter to add a task
taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Load tasks when the page loads
window.addEventListener("load", loadTasks);
