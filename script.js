// Hassan Bukhari | Registration No: 240523

// ---------- Part A: Student Registration Card ----------
const studentForm = document.getElementById("studentForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const program = document.getElementById("program");
const semester = document.getElementById("semester");

const previewCard = document.querySelector("#previewCard");
const previewName = document.querySelector("#previewName");
const previewEmail = document.querySelector("#previewEmail");
const previewProgram = document.querySelector("#previewProgram");
const previewSemester = document.querySelector("#previewSemester");

const registeredStudents = document.querySelector("#registeredStudents");
const studentCount = document.querySelector("#studentCount");
const emptyStudents = document.querySelector("#emptyStudents");
const themeToggle = document.querySelector("#themeToggle");

if (studentForm) {
    function updatePreview() {
        previewName.textContent = fullName.value.trim() || "Your Name";
        previewEmail.textContent = email.value.trim() || "your@email.com";
        previewProgram.textContent = program.value || "Not selected";
        previewSemester.textContent = semester.value || "-";
    }

    // Live preview using input events.
    studentForm.addEventListener("input", updatePreview);

    function setError(id, message) {
        document.getElementById(id).textContent = message;
    }

    function clearErrors() {
        setError("nameError", "");
        setError("emailError", "");
        setError("programError", "");
        setError("semesterError", "");
    }

    studentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors();

        let valid = true;
        const nameValue = fullName.value.trim();
        const emailValue = email.value.trim();
        const semesterValue = Number(semester.value);

        if (nameValue.length < 2) {
            setError("nameError", "Please enter your full name.");
            valid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            setError("emailError", "Please enter a valid email address.");
            valid = false;
        }

        if (!program.value) {
            setError("programError", "Please select a program.");
            valid = false;
        }

        if (!Number.isInteger(semesterValue) || semesterValue < 1 || semesterValue > 12) {
            setError("semesterError", "Semester must be a number from 1 to 12.");
            valid = false;
        }

        if (!valid) return;

        const li = document.createElement("li");
        li.className = "student-item";

        const info = document.createElement("div");
        const name = document.createElement("strong");
        const details = document.createElement("span");

        name.textContent = nameValue;
        details.textContent = `${program.value} • Semester ${semesterValue} • ${emailValue}`;

        info.appendChild(name);
        info.appendChild(details);
        li.appendChild(info);
        registeredStudents.appendChild(li);

        studentCount.textContent = registeredStudents.children.length;
        emptyStudents.style.display = "none";

        studentForm.reset();
        updatePreview();
        fullName.focus();
    });

    themeToggle.addEventListener("click", function () {
        previewCard.classList.toggle("dark");
        themeToggle.textContent = previewCard.classList.contains("dark")
            ? "Switch to Light Mode"
            : "Toggle Dark Mode";
    });
}

// ---------- Part B: Interactive To-Do List ----------
const todoForm = document.getElementById("todoForm");

if (todoForm) {
    const taskInput = document.getElementById("taskInput");
    const todoError = document.getElementById("todoError");
    const taskList = document.getElementById("taskList");
    const taskCounter = document.getElementById("taskCounter");
    const emptyTasks = document.getElementById("emptyTasks");
    const clearCompleted = document.getElementById("clearCompleted");
    const filterButtons = document.querySelectorAll(".filter-btn");

    let currentFilter = "all";

    function getTasks() {
        return Array.from(taskList.querySelectorAll(".task-item"));
    }

    function updateCounter() {
        const tasks = getTasks();
        const remaining = tasks.filter(task => !task.classList.contains("completed")).length;
        const total = tasks.length;
        taskCounter.textContent = `${total} task${total === 1 ? "" : "s"} • ${remaining} remaining`;
        emptyTasks.style.display = total === 0 ? "block" : "none";
    }

    function applyFilter() {
        const tasks = getTasks();

        tasks.forEach(task => {
            const completed = task.classList.contains("completed");
            let visible = true;

            if (currentFilter === "active") visible = !completed;
            if (currentFilter === "completed") visible = completed;

            task.style.display = visible ? "flex" : "none";
        });

        const visibleTasks = tasks.some(task => task.style.display !== "none");
        if (tasks.length > 0 && !visibleTasks) {
            emptyTasks.textContent = "No tasks match this filter.";
            emptyTasks.style.display = "block";
        } else {
            emptyTasks.textContent = "No tasks yet. Add your first task above.";
            emptyTasks.style.display = tasks.length === 0 ? "block" : "none";
        }
    }

    function createTask(text) {
        const li = document.createElement("li");
        li.className = "task-item";
        li.dataset.task = text.toLowerCase();

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.setAttribute("aria-label", `Complete ${text}`);

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.dataset.action = "delete";
        deleteButton.textContent = "Delete";

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    }

    todoForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const value = taskInput.value.trim();
        todoError.textContent = "";

        if (!value) {
            todoError.textContent = "Task cannot be empty.";
            return;
        }

        const duplicate = getTasks().some(task =>
            task.querySelector(".task-text").textContent.trim().toLowerCase() === value.toLowerCase()
        );

        if (duplicate) {
            todoError.textContent = "This task already exists.";
            return;
        }

        createTask(value);
        taskInput.value = "";
        updateCounter();
        applyFilter();
        taskInput.focus();
    });

    // Event delegation: one listener handles all task interactions.
    taskList.addEventListener("click", function (event) {
        const task = event.target.closest(".task-item");
        if (!task) return;

        if (event.target.matches(".delete-btn")) {
            task.remove();
            updateCounter();
            applyFilter();
        }
    });

    taskList.addEventListener("change", function (event) {
        if (!event.target.matches(".task-check")) return;

        const task = event.target.closest(".task-item");
        task.classList.toggle("completed", event.target.checked);
        updateCounter();
        applyFilter();
    });

    // Bonus: double-click a task to edit it inline.
    taskList.addEventListener("dblclick", function (event) {
        const textElement = event.target.closest(".task-text");
        if (!textElement || taskList.querySelector(".edit-input")) return;

        const task = textElement.closest(".task-item");
        const oldText = textElement.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.className = "edit-input";
        input.value = oldText;

        textElement.replaceWith(input);
        input.focus();
        input.select();

        function finishEdit(save) {
            const newText = input.value.trim();

            if (save && newText && !getTasks().some(t =>
                t !== task &&
                t.querySelector(".task-text") &&
                t.querySelector(".task-text").textContent.toLowerCase() === newText.toLowerCase()
            )) {
                textElement.textContent = newText;
            } else {
                textElement.textContent = oldText;
            }

            input.replaceWith(textElement);
            updateCounter();
            applyFilter();
        }

        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") finishEdit(true);
            if (e.key === "Escape") finishEdit(false);
        });

        input.addEventListener("blur", function () {
            finishEdit(true);
        });
    });

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentFilter = button.dataset.filter;
            applyFilter();
        });
    });

    clearCompleted.addEventListener("click", function () {
        getTasks().forEach(task => {
            if (task.classList.contains("completed")) task.remove();
        });
        updateCounter();
        applyFilter();
    });

    updateCounter();
    applyFilter();
}
