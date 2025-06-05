// Load saved tasks on page load
window.onload = loadTodos;

function addTodo(taskObj) {
  let text, dueDate, percentage, subtasks;

  if (taskObj) {
    text = taskObj.text;
    dueDate = taskObj.dueDate;
    percentage = taskObj.percentage;
    subtasks = taskObj.subtasks;
  } else {
    const input = document.getElementById("todo-input");
    text = input.value.trim();
    if (text === "") {
      alert("Please enter a task.");
      return;
    }
    dueDate = prompt("Enter due date (DD/MM/YYYY):");
    percentage = 0;
    subtasks = [];
    input.value = "";
  }

  const li = document.createElement("li");

  // Save due date internally (not displayed)
  li.dataset.dueDate = dueDate;

  // Main task content
  const taskContent = document.createElement("div");
  taskContent.className = "task-content";

  const taskText = document.createElement("span");
  taskText.textContent = text;
  taskText.style.flex = "1";
  taskContent.appendChild(taskText);

  if (dueDate && dueDate.trim() !== "") {
    const daysLeft = calculateDaysLeft(dueDate);
    const daysLeftSpan = document.createElement("small");
    daysLeftSpan.textContent =
      daysLeft >= 0 ? `${daysLeft} day(s) left` : `Overdue by ${-daysLeft} day(s)`;
    daysLeftSpan.className = "days-left";
    if (daysLeft < 0) {
      daysLeftSpan.style.color = "red";
    }
    taskContent.appendChild(daysLeftSpan);
  }

  const addSubtaskBtn = document.createElement("button");
  addSubtaskBtn.textContent = "+";
  addSubtaskBtn.className = "add-subtask-btn";
  addSubtaskBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    addSubtask(li);
  });
  taskContent.appendChild(addSubtaskBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    li.remove();
    saveTodos();
  });
  taskContent.appendChild(deleteBtn);

  li.appendChild(taskContent);

  // Slider
  const sliderContainer = document.createElement("div");
  sliderContainer.className = "slider-container";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "100";
  slider.value = percentage;

  const percentageSpan = document.createElement("span");
  percentageSpan.textContent = `${percentage}%`;

  slider.addEventListener("input", function () {
    percentageSpan.textContent = `${slider.value}%`;
    if (slider.value === "100") {
      li.classList.add("completed");
    } else {
      li.classList.remove("completed");
    }
    saveTodos();
  });

  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(percentageSpan);

  li.appendChild(sliderContainer);

  // Subtasks
  const subtaskList = document.createElement("ul");
  subtaskList.className = "subtasks";
  li.appendChild(subtaskList);

  if (subtasks && subtasks.length > 0) {
    subtasks.forEach(subtaskObj => {
      addSubtask(li, subtaskObj);
    });
  }

  document.getElementById("todo-list").appendChild(li);
  saveTodos();
}

function addSubtask(parentLi, subtaskObj) {
  let subtaskText, dueDate;

  if (subtaskObj) {
    subtaskText = subtaskObj.text;
    dueDate = subtaskObj.dueDate;
  } else {
    subtaskText = prompt("Enter subtask:");
    if (!subtaskText || subtaskText.trim() === "") return;
    dueDate = prompt("Enter due date for subtask (DD/MM/YYYY):");
  }

  const subtaskLi = document.createElement("li");

  // Save due date internally
  subtaskLi.dataset.dueDate = dueDate;

  const subtaskContent = document.createElement("div");
  subtaskContent.className = "subtask-content";

  const subtaskSpan = document.createElement("span");
  subtaskSpan.textContent = subtaskText;
  subtaskSpan.style.flex = "1";
  subtaskContent.appendChild(subtaskSpan);

  if (dueDate && dueDate.trim() !== "") {
    const daysLeft = calculateDaysLeft(dueDate);
    const daysLeftSpan = document.createElement("small");
    daysLeftSpan.textContent =
      daysLeft >= 0 ? `${daysLeft} day(s) left` : `Overdue by ${-daysLeft} day(s)`;
    daysLeftSpan.className = "days-left";
    if (daysLeft < 0) {
      daysLeftSpan.style.color = "red";
    }
    subtaskContent.appendChild(daysLeftSpan);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    subtaskLi.remove();
    saveTodos();
  });
  subtaskContent.appendChild(deleteBtn);

  subtaskLi.appendChild(subtaskContent);

  subtaskSpan.addEventListener("click", function (e) {
    e.stopPropagation();
    subtaskLi.classList.toggle("completed");
    saveTodos();
  });

  parentLi.querySelector(".subtasks").appendChild(subtaskLi);
  saveTodos();
}

function calculateDaysLeft(dateStr) {
  const [day, month, year] = dateStr.split("/").map(Number);
  const dueDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = dueDate - today;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

function saveTodos() {
  const todos = [];
  document.querySelectorAll("#todo-list > li").forEach(li => {
    const text = li.querySelector(".task-content span").textContent;
    const dueDate = li.dataset.dueDate || "";
    const sliderValue = li.querySelector("input[type='range']").value;

    const subtasks = [];
    li.querySelectorAll(".subtasks li").forEach(subLi => {
      const subText = subLi.querySelector("span").textContent;
      const subDueDate = subLi.dataset.dueDate || "";
      subtasks.push({ text: subText, dueDate: subDueDate });
    });

    todos.push({
      text: text,
      dueDate: dueDate,
      percentage: sliderValue,
      subtasks: subtasks
    });
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const json = localStorage.getItem("todos");
  if (!json) return;
  const todos = JSON.parse(json);
  todos.forEach(todo => {
    addTodo(todo);
  });
}
