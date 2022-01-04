// Attach Events
document.addEventListener("DOMContentLoaded", initApp);

//Globals
const taskList = document.querySelector(".task_list");
const userList = document.querySelector("select.input_task");
let tasks = [];
let users = [];

//Basic logic
function getUserName(userId)
{
    const user = users.find(u => u.id === userId);
    return user.name;
}

function printTasks({id, userId, title, completed}) {
    const li = document.createElement("li");
    li.className = "task_item";
    li.dataset.id = id;
    li.innerHTML = `<span class="item_txt">${title} <i>by</i> <b>${getUserName(userId)}</b>`;

    const status = document.createElement("input");
    status.type = "checkbox";
    status.checked = completed;

    const close = document.createElement("span");
    close.innerHTML = "&times;";
    close.className = "close";

    li.prepend(status);
    li.append(close);

    taskList.prepend(li);

}

function printUsers(id, name) {
    const option = document.createElement("option");
    option.innerText = name;

    userList.prepend(option);

}

//Event logic

function initApp() {
    Promise.all([getAllTasks(), getAllUsers()]).then(
        values => {
            [tasks, users] = values; 
            
            tasks.forEach(task => printTasks(task));
            users.forEach(user => printUsers(user.id, user.name));
        } 
    );

}


// Async logic
async function getAllTasks() {
    const respone = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await respone.json();

    return data;
}

async function getAllUsers() {
    const respone = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await respone.json();

    return data;
}

