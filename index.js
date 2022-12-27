const todo_input = document.querySelector("#id_todo_input");
const tasks_section = document.querySelector("#id_tasks_section");

var taskCounter = 0;
var completedTaskCounter = 0;

function todo(title) {
    const todoCard = document.createElement("li");
    todoCard.classList.add("todo-card");

    const todoCheck = document.createElement("input");
    todoCheck.classList.add("todo-checkbox");
    todoCheck.type="checkbox";

    const todoTitle = document.createElement("input");
    todoTitle.className = "todo-title";
    todoTitle.value = title;
    todoTitle.type="text";
    todoTitle.disabled = true;

    const todoMenu = document.createElement("div");
    todoMenu.className = "flex dir-row-reverse todo-menu";
    const menuItemOpenMenu = document.createElement("span");
    menuItemOpenMenu.className = "fa fa-ellipsis-h";
    const menuItemOpenMenuClass = menuItemOpenMenu.className;
    todoMenu.appendChild(menuItemOpenMenu);

    const todoMenuPanel = (action) => {
        if (action === "open"){
            const menuItemEdit = document.createElement("span");
            menuItemEdit.className = "menu-item fa fa-pencil";
            const menuItemDelete = document.createElement("span");
            menuItemDelete.className = "menu-item fa fa-trash";
            todoMenu.appendChild(menuItemEdit);
            todoMenu.appendChild(menuItemDelete);

            menuItemEdit.addEventListener('click', () => { 
                if (todoTitle.disabled == true) {
                    todoTitle.disabled = false;
                    console.log("false");
                } else {
                    if (todoTitle.value != "") {
                        todoTitle.disabled = true;
                    } else {
                        todoTitle.style.border = "2px solid red";
                    }
                }
            });
            menuItemDelete.addEventListener('click', () => {
                if (todoCard.classList.contains("completed")) {
                    completedTaskCounter -= 1;
                }
                tasks_section.removeChild(todoCard);
                taskCounter -= 1;
                updateTasksInfos();
            });

        } else {
            const menuItems = todoMenu.querySelectorAll(".menu-item");
            menuItems.forEach(item => todoMenu.removeChild(item));
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
        } else {
            todoCard.classList.remove("completed");
            completedTaskCounter -= 1;
        }
        updateTasksInfos();
    });

    todoCard.appendChild(todoCheck);
    todoCard.appendChild(todoTitle);
    todoCard.appendChild(todoMenu);
    tasks_section.appendChild(todoCard);

}

todo_input.addEventListener('keydown', (event) => {
    if (event.key === "Enter" && todo_input.value != "") {
        switchButtonState(0);
        buttonActions("showAll");
        todo(todo_input.value);
        todo_input.value = "";
        taskCounter += 1;
        updateTasksInfos();
        allTasks = document.querySelectorAll(".todo-card");
        localStorage.setItem('all-tasks', JSON.stringify(allTasks[0]));
        console.warn(JSON.parse(localStorage.getItem('all-tasks')));
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

function buttonActions(action) {
    tasks_items = document.querySelectorAll(".todo-card");
    for (let i = 0; i < tasks_items.length; i++) {
        switch(action) {
            case "showAll":
                tasks_items[i].style.display = "flex";
                break;
            case "showPending":
                if (!tasks_items[i].classList.contains("completed")) {
                    tasks_items[i].style.display = "flex";
                } else {
                    tasks_items[i].style.display = "none";
                }
                break;
            case "showCompleted":
                if (tasks_items[i].classList.contains("completed")) {
                    tasks_items[i].style.display = "flex";
                } else {
                    tasks_items[i].style.display = "none";
                }
                break;
            case "clearAll":
                tasks_section.removeChild(tasks_items[i]);
                taskCounter = 0;
                completedTaskCounter = 0;
                updateTasksInfos();
                break;
        }
    }
}

const all_tasks_info = document.getElementById("id_all_info");
const completed_tasks_info = document.getElementById("id_completed_info");
const pending_tasks_info = document.getElementById("id_pending_info");

const updateTasksInfos = () => {
    all_tasks_info.innerText = `Tasks: ${taskCounter}`;
    completed_tasks_info.innerText = `Completed: ${completedTaskCounter}`;
    pending_tasks_info.innerText = `Pending: ${taskCounter - completedTaskCounter}`;
}
updateTasksInfos();
