// Attach Events
document.addEventListener("DOMContentLoaded", initApp);

//Globals
const taskList = document.querySelector(".task_list");
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
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b>`

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

//Event logic

function initApp() {
    Promise.all([getAllTasks(), getAllUsers()]).then(
        values => {
            [tasks, users] = values; 
            
            //Отправить в разметку
            tasks.forEach(task => printTasks(task));
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

