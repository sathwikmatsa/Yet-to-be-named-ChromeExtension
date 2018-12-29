let addTaskDiv = document.getElementById("add_task_section");
let newTaskDiv = document.getElementById("NewTasks");
let tasks;

function createElementFromHTML(html){
    let div = document.createElement("div");
    div.innerHTML = html.trim();
    return div.firstChild;
}

function findTaskIndex(todo){
    let nTasks = tasks.length;
    for(let i = 0; i < nTasks; i++){
        if(tasks[i].todo === todo) return i;
    }
}

function completeTask(evt){
    let todo = evt.currentTarget.nextElementSibling.innerText;
    let taskIndex = findTaskIndex(todo);
    if(evt.currentTarget.checked) {
        evt.currentTarget.nextElementSibling.innerHTML = "<s>" + todo + "</s>";
        tasks[taskIndex].complete = true;
    }
    else {
        evt.currentTarget.nextElementSibling.innerHTML = todo;
        tasks[taskIndex].complete = false;
    }
    chrome.storage.sync.set({NewTasks: tasks});
}

function displayOptions(evt){
    let property = evt.currentTarget.nextElementSibling.style.display;
    evt.currentTarget.nextElementSibling.style.display = (property === "block" ? "none" : "block");
}

function clearOptions(evt){
    evt.currentTarget.nextElementSibling.style.display = "none";
}

function showOptionGear(evt){
    try{
        if(evt.currentTarget.getElementsByClassName("dropdown-content")[0].style.display == "block") return;
        evt.currentTarget.getElementsByClassName("dropdown")[0].style.display = "inline-block";
    } catch(error){
        // ignore
    }
}

function hideOptionGear(evt){
    try{
        if(evt.currentTarget.getElementsByClassName("dropdown-content")[0].style.display == "block") return;
        evt.currentTarget.getElementsByClassName("dropdown")[0].style.display = "none";
    } catch(error){
        // ignore
    }
}

function deleteTask(evt){
    let todo = evt.currentTarget.parentElement.parentElement.previousElementSibling.innerText;
    let taskIndex = findTaskIndex(todo);
    // remove task from tasks list
    tasks.splice(taskIndex, 1);
    // update storage
    chrome.storage.sync.set({NewTasks: tasks});
    // update frontend
    if(taskIndex != 0) evt.currentTarget.parentElement.parentElement.parentElement.parentElement.previousElementSibling.remove(); // remove above <hr> element
    else if(tasks.length != 0) evt.currentTarget.parentElement.parentElement.parentElement.parentElement.nextElementSibling.remove(); // remove below <hr> if 1st
    evt.currentTarget.parentElement.parentElement.parentElement.parentElement.remove();
}

function saveTask(evt){
    let modifiedTodo = evt.currentTarget.parentElement.previousElementSibling.value;
    let prevTodo = evt.currentTarget.parentElement.previousElementSibling.getAttribute("prev");
    let taskDiv = evt.currentTarget.parentElement.parentElement;
    taskDiv.innerHTML = "";
    let taskIndex = findTaskIndex(prevTodo);
    tasks[taskIndex].todo = modifiedTodo;
    taskDiv.appendChild(createTaskItem(modifiedTodo, tasks[taskIndex].complete).firstElementChild);
    chrome.storage.sync.set({NewTasks: tasks});
}

function cancelEdit(evt){
    let prevTodo = evt.currentTarget.parentElement.previousElementSibling.getAttribute("prev");
    let taskDiv = evt.currentTarget.parentElement.parentElement;
    taskDiv.innerHTML = "";
    let taskIndex = findTaskIndex(prevTodo);
    taskDiv.appendChild(createTaskItem(prevTodo, tasks[taskIndex].complete).firstElementChild);
}

function editTask(evt){
    let taskDiv = evt.currentTarget.parentElement.parentElement.parentElement.parentElement;
    let todo = evt.currentTarget.parentElement.parentElement.previousElementSibling.innerText;
    console.log(todo);
    taskDiv.innerHTML = `
        <input id="editText" class="input" type="text">
        <span>
            <button id="save" class="edit-options save">save</button>
            <button id="cancel" class="edit-options cancel">cancel</button>
        </span>
    `;
    taskDiv.firstElementChild.defaultValue = todo;
    taskDiv.firstElementChild.setAttribute("prev", todo);
    taskDiv.getElementsByTagName("button")[0].addEventListener("click", saveTask);
    taskDiv.getElementsByTagName("button")[1].addEventListener("click", cancelEdit);
}

function createTaskItem(taskString, isComplete){
    let taskTemplate = `
        <div class="task">
            <label>
                <input type="checkbox"> <span>` + taskString + `</span>
                <div class="dropdown">
                    <input type="image" src="../../assets/ellipsis.png" />
                    <div class="dropdown-content">
                      <a>edit</a>
                      <a>delete</a>
                    </div>
                </div>
            </label>
        </div>
    `;
    let taskDiv = createElementFromHTML(taskTemplate);
    taskDiv.addEventListener("mouseover", showOptionGear);
    taskDiv.addEventListener("mouseout", hideOptionGear);
    let checkBox = taskDiv.getElementsByTagName('input')[0];
    checkBox.addEventListener("change", completeTask);
    checkBox.checked = isComplete;
    if(isComplete) checkBox.nextElementSibling.innerHTML = "<s>" + checkBox.nextElementSibling.innerText + "</s>";
    let options = taskDiv.getElementsByTagName('input')[1];
    options.addEventListener("click", displayOptions);
    let edit = taskDiv.getElementsByTagName('a')[0];
    edit.addEventListener("click", editTask);
    let del = taskDiv.getElementsByTagName('a')[1];
    del.addEventListener("click", deleteTask);
    return taskDiv;
}

chrome.storage.sync.get(['NewTasks'], function(result) {
    if(result.NewTasks){
        document.getElementById("NewTasksHeading").style.display = "block";
        tasks = result.NewTasks;
        let nTasks = tasks.length;
        for(let i = 0; i < nTasks; i++){
            if(i != 0) newTaskDiv.appendChild(document.createElement("hr"));
            newTaskDiv.appendChild(createTaskItem(tasks[i].todo, tasks[i].complete));
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
        //TODO: discard duplicate tasks
        let input = document.getElementById("inputText");
        if(input.value === "") return;
        else document.getElementById("NewTasksHeading").style.display = "block";
        if(tasks.length != 0) newTaskDiv.appendChild(document.createElement("hr"));
        newTaskDiv.appendChild(createTaskItem(input.value.trim(), false));
        tasks.push({todo:input.value.trim(), complete:false});
        chrome.storage.sync.set({NewTasks: tasks}, function() {
          console.log('New task added to storage :' + tasks[tasks.length-1]);
        });
        event.currentTarget.setAttribute("state", "Normal");
        addTaskDiv.innerHTML = "";
    }
});
