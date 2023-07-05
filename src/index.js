const todo_input = document.querySelector("#id_todo_input");
todo_input.maxLength = 50;
const tasks_section = document.querySelector("#id_tasks_section");

var taskCounter = 0;
var completedTaskCounter = 0;
let myTasks, tasksInfos;

var currentAction;

const getTasksInfos = () => {
    tasksInfos = JSON.parse(localStorage.getItem('tasksInfos'));
}
const setTasksInfos = () => {
    localStorage.setItem('tasksInfos', JSON.stringify(tasksInfos));
}

getTasksInfos();
if (!tasksInfos) {
    const tasks_infos = {
        "all": 0,
        "pending": 0,
        "completed": 0
    }
    localStorage.setItem('tasksInfos', JSON.stringify(tasks_infos));
    getTasksInfos();
}


const getMyTasks = () => {
    myTasks = JSON.parse(localStorage.getItem('tasks'));
}
const setMyTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(myTasks));
}
getMyTasks();
if (!myTasks) {
    localStorage.setItem('tasks', JSON.stringify([]));
    getMyTasks();
}

function createTodo(title, completed, save, index) {
    const todoCard = document.createElement("li");
    todoCard.classList.add("todo-card");
    { save ? todoCard.setAttribute('index', myTasks.length) : todoCard.setAttribute('index', index) }
    const todoCardIndex = parseInt(todoCard.getAttribute('index'));

    const todoCheck = document.createElement("input");
    todoCheck.classList.add("todo-checkbox");
    todoCheck.type = "checkbox";

    if (completed == true) {
        todoCheck.checked = true;
        todoCard.classList.add("completed");
    } else {
        todoCheck.checked = false;
        todoCard.classList.remove("completed");
    }

    const todoTitle = document.createElement("input");
    todoTitle.className = "todo-title";
    todoTitle.value = title;
    todoTitle.type = "text";
    todoTitle.disabled = true;

    const todoMenu = document.createElement("div");
    todoMenu.className = "flex dir-row-reverse todo-menu";
    const menuItemOpenMenu = document.createElement("span");
    menuItemOpenMenu.className = "fa fa-ellipsis-h";
    const menuItemOpenMenuClass = menuItemOpenMenu.className;
    todoMenu.appendChild(menuItemOpenMenu);

    const todoMenuPanel = (action) => {
        if (action === "open") {
            const menuItemEdit = document.createElement("span");
            menuItemEdit.className = "menu-item fa fa-pencil";
            const menuItemDelete = document.createElement("span");
            menuItemDelete.className = "menu-item fa fa-trash";
            todoMenu.appendChild(menuItemEdit);
            todoMenu.appendChild(menuItemDelete);
            let old_title;

            function saveEdit() {
                if (todoTitle.value != "") {
                    todoTitle.disabled = true;
                    if (todoTitle.value != old_title) {
                        myTasks[todoCardIndex].title = todoTitle.value;
                        setMyTasks();
                    }
                } else {
                    todoTitle.style.border = "2px solid red";
                }
            }

            menuItemEdit.addEventListener('click', () => {
                if (todoTitle.disabled == true) {
                    todoTitle.disabled = false;
                    old_title = todoTitle.value; 
                    todoTitle.onkeydown = (e) => {
                        if (e.key === "Enter") {
                            saveEdit();
                        }
                    }
                } else {
                    saveEdit();
                }
            });
            menuItemDelete.addEventListener('click', () => {
                if (todoCard.classList.contains("completed")) {
                    completedTaskCounter -= 1;
                    tasksInfos.completed -= 1;
                }
                tasks_section.removeChild(todoCard);
                myTasks.splice(todoCardIndex, 1);
                tasksInfos.all -= 1;
                updateTasksInfos();
                setTasksInfos();
                setMyTasks();
            });
        } else {
            const menuItems = todoMenu.querySelectorAll(".menu-item");
            menuItems.forEach(item => todoMenu.removeChild(item));
            if (todoTitle.value == "") {
                todoTitle.value = myTasks[todoCardIndex].title;
                todoTitle.disabled = true;
                todoTitle.style.border = "none";
            }
        }
    }

    let todoMenuOpened = false;
    menuItemOpenMenu.addEventListener('click', () => {
        if (todoMenuOpened == false) {
            todoMenuPanel("open");
            todoMenuOpened = true;
            menuItemOpenMenu.className = "fa fa-close";
        } else {
            todoMenuPanel("close");
            todoMenuOpened = false;
            menuItemOpenMenu.className = menuItemOpenMenuClass;
        }
    });

    todoCheck.addEventListener('change', () => {
        if (todoCheck.checked == true) {
            todoCard.classList.add("completed");
            completedTaskCounter += 1;
            tasksInfos.completed += 1;
            myTasks[todoCardIndex].completed = true;
        } else {
            todoCard.classList.remove("completed");
            completedTaskCounter -= 1;
            tasksInfos.completed -= 1;
            myTasks[todoCardIndex].completed = false;
        }
        buttonActions(currentAction);
        updateTasksInfos();
        setTasksInfos();
        setMyTasks();
    });

    todoCard.appendChild(todoCheck);
    todoCard.appendChild(todoTitle);
    todoCard.appendChild(todoMenu);
    tasks_section.appendChild(todoCard);

    if (save) {
        const task = {
            "title": title,
            "completed": completed
        }
        myTasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(myTasks));
    }

}

myTasks.forEach((task, index) => {
    createTodo(task.title, task.completed, false, index);
});

todo_input.addEventListener('keydown', (event) => {
    if (event.key === "Enter" && todo_input.value != "") {
        switchButtonState(0);
        buttonActions("showAll");
        createTodo(todo_input.value, false, true);
        todo_input.value = "";
        taskCounter += 1;
        tasksInfos.all += 1;
        setTasksInfos();
        updateTasksInfos();
        allTasks = document.querySelectorAll(".todo-card");
    }
});

const panel_buttons = document.querySelectorAll(".button");
let actived;

function switchButtonState(button) {
    for (let i = 0; i < 3; i++) {
        if (button == i) {
            panel_buttons[i].classList.add("active");
        } else {
            panel_buttons[i].classList.remove("active");
        }
    }
}

switchButtonState(0);
for (let i = 0; i < 3; i++) {
    panel_buttons[i].addEventListener('click', () => {
        switchButtonState(i);
    });
}

let setButtonAction = (action) => {
    currentAction = action;
}

function buttonActions(action) {
    tasks_items = document.querySelectorAll(".todo-card");
    for (let i = 0; i < tasks_items.length; i++) {
        switch (action) {
            case "showAll":
                tasks_items[i].style.display = "flex";
                setButtonAction(action);
                break;
            case "showPending":
                if (!tasks_items[i].classList.contains("completed")) {
                    tasks_items[i].style.display = "flex";
                } else {
                    tasks_items[i].style.display = "none";
                }
                setButtonAction(action);
                break;
            case "showCompleted":
                if (tasks_items[i].classList.contains("completed")) {
                    tasks_items[i].style.display = "flex";
                } else {
                    tasks_items[i].style.display = "none";
                }
                setButtonAction(action);
                break;
            case "clearAll":
                tasks_section.removeChild(tasks_items[i]);
                myTasks.splice(0, myTasks.length);
                tasksInfos.all = 0;
                tasksInfos.completed = 0;
                setTasksInfos();
                setMyTasks();
                updateTasksInfos();
                break;
        }
    }
}

const all_tasks_info = document.getElementById("id_all_info");
const completed_tasks_info = document.getElementById("id_completed_info");
const pending_tasks_info = document.getElementById("id_pending_info");

const updateTasksInfos = () => {
    all_tasks_info.innerText = `Tasks: ${tasksInfos.all}`;
    completed_tasks_info.innerText = `Completed: ${tasksInfos.completed}`;
    pending_tasks_info.innerText = `Pending: ${tasksInfos.all - tasksInfos.completed}`;
}
updateTasksInfos();
