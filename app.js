(function() {
    
    // Attach Events
    document.addEventListener("DOMContentLoaded", initApp);
    document.addEventListener('submit', handleSubmit);
    
    //Globals
    const taskList = document.querySelector(".task_list");
    const userList = document.querySelector("select.input_task");
    const form = document.querySelector("form");
    const alertWindow = document.querySelector(".window");
    let tasks = [];
    let users = [];
    
    //Basic logic
    function handleSubmit(event) {
        event.preventDefault();
    
        createTask({
            userId: Number(form.user_list.value),
            title: form.task_text.value,
            completed: false,
        });
    }
    
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
        status.addEventListener("change", handleTaskChange);
    
        const close = document.createElement("span");
        close.innerHTML = "&times;";
        close.className = "close";
        close.addEventListener('click', handleDeleteTask);
    
        li.prepend(status);
        li.append(close);
    
        taskList.prepend(li);
    
    }
    
    function handleDeleteTask() {
        const taskId = this.parentElement.dataset.id;
        deleteTask(taskId);
    }
    
    function printUsers(user) {
        const option = document.createElement("option");
        option.innerText = user.name;
        option.value = user.id;
    
        userList.prepend(option);
    
    }
    
    function removeTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
    
        const task = taskList.querySelector(`[data-id="${taskId}"]`);
        task.querySelector("input").removeEventListener('change', handleTaskChange);
        task.querySelector('.close').removeEventListener('click', handleDeleteTask);
        task.remove();
    }
    
    function sendAlert(error) {
        const alertMessage = document.querySelector(".alert_text");
        alertMessage.innerText = error.message;
    
        alertWindow.classList.remove("hide");
    
        const closeButton = document.querySelector(".window .close");
        closeButton.addEventListener("click", handleCloseAlertWindow);
    }
    //Event logic
    
    function initApp() {
        Promise.all([getAllTasks(), getAllUsers()]).then(
            values => {
                [tasks, users] = values; 
                
                tasks.forEach(task => printTasks(task));
                users.forEach(user => printUsers(user));
            } 
        );
    
    }
    
    function handleCloseAlertWindow(e) {
        alertWindow.classList.add("hide");
        e.target.removeEventListener("click", handleCloseAlertWindow);
    }
    
    function handleTaskChange() {
        const taskId = this.parentElement.dataset.id;
        const completed = this.checked;
    
        toggleTaskComplete({taskId, completed});
    }
    
    // Async logic
    async function getAllTasks() {
        try {
            const respone = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
            const data = await respone.json();
        
            return data;
        } catch (error) {
            sendAlert(error);
        }
    
    }
    
    async function getAllUsers() {
        try {
            const respone = await fetch("https://jsonplaceholder.typicode.com/users");
            const data = await respone.json();
        
            return data;
    
        } catch (error) {
            sendAlert(error);
        }
    }
    
    async function createTask(task)
    {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
                method: "POST",
                body: JSON.stringify(task),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const taskId = await response.json();
            console.log(taskId);
    
            printTasks({id: taskId, ...task});
            
        } catch (error) {
            sendAlert(error);
        }
    }
    
    async function toggleTaskComplete({taskId, completed}) {
    
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`,{
                method: "PATCH",
                body: JSON.stringify({completed: completed}),
                headers: {
                    "Content-Type": "application/json"
                },
            });
        
            const responseData = await response.json();
        
            if (!response.ok) {
                throw new Error(`Error: server returns: ${response.status}`);
            }
            
        } catch (error) {
            sendAlert(error);
        }
    }
    
    async function deleteTask(taskId) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
                method: "DELETE",
            });
        
            if (response.ok){
                removeTask(taskId);
            } else {
                throw new Error(`Error: server returns: ${response.status}`);
            }
            
        } catch (error) {
            sendAlert(error);
        }
    }
})();