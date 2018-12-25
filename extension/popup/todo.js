let addTaskDiv = document.getElementById("add_task_section");
let taskDiv = document.getElementById("NewTasks");
let tasks;

function createElementFromHTML(html){
    let div = document.createElement("div");
    div.innerHTML = html.trim();
    return div.firstChild;
}

chrome.storage.sync.get(['NewTasks'], function(result) {
    if(result.NewTasks){
        console.log("tasks present!");
        document.getElementById("NewTasksHeading").style.display = "block";
        tasks = result.NewTasks;
        let nTasks = tasks.length;
        let task = document.createElement("p");
        task.className = "task";
        task.innerText = tasks[0];
        taskDiv.appendChild(task);
        for(let i = 1; i < nTasks; i++){
            taskDiv.appendChild(document.createElement("hr"));
            task = document.createElement("p");
            task.className = "task";
            task.innerText = tasks[i];
            taskDiv.appendChild(task);
        }
    } else {
        console.log("no tasks", result.key);
        tasks = [];
    }
});

document.getElementById("addTaskBtn").addEventListener("click", function(event){
    if(event.currentTarget.getAttribute("state") === "Normal"){
        addTaskDiv.innerHTML = `
            <input id="inputText" class="input" type="text" placeholder="enter your task">
        `;
        event.currentTarget.setAttribute("state", "Input");
    } else {
        let input = document.getElementById("inputText");
        if(input.value === "") return;
        let task = document.createElement("p");
        task.className = "task";
        task.innerText = input.value;
        if(tasks.length != 0) taskDiv.appendChild(document.createElement("hr"));
        taskDiv.appendChild(task);
        tasks.push(input.value);
        chrome.storage.sync.set({NewTasks: tasks}, function() {
          console.log('New task added to storage :' + tasks[tasks.length-1]);
        });
        event.currentTarget.setAttribute("state", "Normal");
        addTaskDiv.innerHTML = "";
    }
});
