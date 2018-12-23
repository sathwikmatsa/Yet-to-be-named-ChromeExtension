document.getElementById("addTaskBtn").addEventListener("click", function(event){
    let addTaskDiv = document.getElementById("add_task");
    let taskDiv = document.getElementById("tasks");
    if(event.currentTarget.getAttribute("state") === "Normal"){
        addTaskDiv.innerHTML = `
            <input id="inputText" class="input" type="text" placeholder="enter your task">
        `;
        event.currentTarget.setAttribute("state", "Input");
    } else {
        let input = document.getElementById("inputText");
        if(input.value === "") return;
        let task = document.createElement("p");
        task.innerText = input.value;
        taskDiv.appendChild(task);
        event.currentTarget.setAttribute("state", "Normal");
        addTaskDiv.innerHTML = "";
    }
});
