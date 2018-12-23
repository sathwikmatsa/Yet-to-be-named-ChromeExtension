let addTaskDiv = document.getElementById("add_task");
let taskDiv = document.getElementById("tasks");
let tasks;

chrome.storage.sync.get(['NewTasks'], function(result) {
    if(result.NewTasks){
        console.log("tasks present!");
        tasks = result.NewTasks;
        let nTasks = tasks.length;
        for(let i = 0; i < nTasks; i++){
            let task = document.createElement("p");
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
        taskDiv.appendChild(task);
        tasks.push(input.value);
        chrome.storage.sync.set({NewTasks: tasks}, function() {
          console.log('New task added to storage :' + tasks[tasks.length-1]);
        });
        event.currentTarget.setAttribute("state", "Normal");
        addTaskDiv.innerHTML = "";
    }
});
