const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const stats = document.getElementById("stats");
const message = document.getElementById("message");
const filterButtons = document.querySelectorAll(".filter");

let tasks = [];
let nextId = 1;
let currentFilter = "all";

function getFilteredTasks() {
    return tasks.filter((task) => {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });
}

function updateStats() {
    const completedCount = tasks.filter((task) => task.completed).length;
    const activeCount = tasks.filter((task) => !task.completed).length;

    stats.textContent = `Осталось: ${activeCount}, Выполнено: ${completedCount}`;
}

function render() {
    list.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty";
        emptyItem.textContent = "Нет задач";
        list.appendChild(emptyItem);
    } else {
        filteredTasks
            .map((task) => {
                const item = document.createElement("li");
                item.className = `todo-item${task.completed ? " completed" : ""}`;

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.completed;
                checkbox.setAttribute("aria-label", "Отметить задачу как выполненную");

                checkbox.addEventListener("change", () => {
                    toggleTask(task.id);
                });

                const text = document.createElement("span");
                text.textContent = task.text;

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "delete";
                deleteButton.textContent = "Удалить";

                deleteButton.addEventListener("click", () => {
                    deleteTask(task.id);
                });

                item.append(checkbox, text, deleteButton);
                return item;
            })
            .forEach((item) => list.appendChild(item));
    }

    updateStats();
}

function addTask(text) {
    const trimmedText = text.trim();

    if (trimmedText === "") {
        message.textContent = "Введите текст задачи.";
        return;
    }

    tasks.push({
        id: nextId++,
        text: trimmedText,
        completed: false
    });

    message.textContent = "";
    input.value = "";
    input.focus();
    render();
}

function toggleTask(id) {
    tasks = tasks.map((task) =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    render();
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    render();
}

function setFilter(filter) {
    currentFilter = filter;

    filterButtons.forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );
    });

    render();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask(input.value);
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setFilter(button.dataset.filter);
    });
});

render();
