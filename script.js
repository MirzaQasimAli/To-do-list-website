const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const prioritySelect = document.getElementById("priority-select");
const dueDateInput = document.getElementById("due-date-input");
const tagsInput = document.getElementById("tags-input");
const reminderInput = document.getElementById("reminder-input");
const subtaskInput = document.getElementById("subtask-input");
const subtaskList = document.getElementById("subtask-list");
const repeatSelect = document.getElementById("repeat-select");
const notesInput = document.getElementById("notes-input");
const searchInput = document.getElementById("search-input");
const filterSelect = document.getElementById("filter-select");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const appContainer = document.querySelector(".app-container");
const deleteAllTasksBtn = document.getElementById("delete-all-tasks");
const localStorageKey = "tasks";

// Attach event listeners
addTaskBtn.addEventListener("click", addTask);
darkModeToggle.addEventListener("click", toggleDarkMode);
deleteAllTasksBtn.addEventListener("click", deleteAllTasks);
searchInput.addEventListener("input", filterTasks);
filterSelect.addEventListener("change", filterTasks);
window.addEventListener("load", loadTasks);

// Initialize Sortable for drag-and-drop sorting
new Sortable(taskList, {
    animation: 150,
    handle: ".drag-handle",
    onUpdate: updateSortOrder
});

function addTask() {
    console.log("addTask function called");
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${taskText}</span>
            <span class="tags">${tagsInput.value}</span>
            <span class="priority">${prioritySelect.value}</span>
            <span class="due-date">${dueDateInput.value}</span>
            <span class="reminder">${reminderInput.value}</span>
            <button class="complete-btn">Complete</button>
            <button class="delete-btn">Delete</button>
            <input class="subtask-input" type="text" placeholder="Add subtask">
            <ul class="subtask-list"></ul>
        `;
        taskList.appendChild(li);
        taskInput.value = "";
        prioritySelect.value = "medium";
        dueDateInput.value = "";
        tagsInput.value = "";
        reminderInput.value = "";

        attachTaskEventListeners(li);

        // Add event listener for subtask creation
        const subtaskInput = li.querySelector(".subtask-input");
        const subtaskList = li.querySelector(".subtask-list");
        subtaskInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                addSubtask(subtaskInput, subtaskList);
            }
        });
    }
}

function attachTaskEventListeners(taskElement) {
    taskElement.querySelector(".complete-btn").addEventListener("click", completeTask);
    taskElement.querySelector(".delete-btn").addEventListener("click", deleteTask);
}

function completeTask(event) {
    const task = event.target.parentNode;
    task.classList.toggle("complete");
    saveTasks();
}

function deleteTask(event) {
    const task = event.target.parentNode;
    taskList.removeChild(task);
    saveTasks();
}

function updateSortOrder(event) {
    const tasks = document.querySelectorAll("#task-list li");
    tasks.forEach((task, index) => {
        task.querySelector(".task-order").textContent = index + 1;
    });
    saveTasks();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#task-list li").forEach(task => {
        const taskDetails = {
            text: task.querySelector("span").textContent,
            tags: task.querySelector(".tags").textContent,
            priority: task.querySelector(".priority").textContent,
            dueDate: task.querySelector(".due-date").textContent,
            reminder: task.querySelector(".reminder").textContent,
            completed: task.classList.contains("complete"),
            subtasks: []
        };

        task.querySelectorAll(".subtask-list li").forEach(subtask => {
            taskDetails.subtasks.push({
                text: subtask.querySelector("span").textContent,
                completed: subtask.querySelector("input[type='checkbox']").checked
            });
        });

        tasks.push(taskDetails);
    });

    localStorage.setItem(localStorageKey, JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    tasks.forEach(taskDetails => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${taskDetails.text}</span>
            <span class="tags">${taskDetails.tags}</span>
            <span class="priority">${taskDetails.priority}</span>
            <span class="due-date">${taskDetails.dueDate}</span>
            <span class="reminder">${taskDetails.reminder}</span>
            <button class="complete-btn">Complete</button>
            <button class="delete-btn">Delete</button>
            <input class="subtask-input" type="text" placeholder="Add subtask">
            <ul class="subtask-list"></ul>
        `;
        if (taskDetails.completed) {
            li.classList.add("complete");
        }
        taskList.appendChild(li);
        attachTaskEventListeners(li);

        const subtaskInput = li.querySelector(".subtask-input");
        const subtaskList = li.querySelector(".subtask-list");
        subtaskInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                addSubtask(subtaskInput, subtaskList);
            }
        });

        taskDetails.subtasks.forEach(subtaskDetails => {
            const subtaskLi = document.createElement("li");
            subtaskLi.innerHTML = `
                <input type="checkbox" ${subtaskDetails.completed ? "checked" : ""}>
                <span>${subtaskDetails.text}</span>
                <button class="delete-subtask-btn">Delete</button>
            `;
            subtaskList.appendChild(subtaskLi);
        });
    });
}

function toggleDarkMode() {
    appContainer.classList.toggle("dark-mode");
}

function deleteAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        taskList.innerHTML = "";
        saveTasks();
    }
}

