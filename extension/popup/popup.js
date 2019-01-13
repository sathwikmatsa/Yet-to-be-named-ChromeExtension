let contentDiv = document.getElementById("content");
contentDiv.innerHTML='<object type="text/html" data="todo-list/todo.html" width="730px" height="550px"></object>';
contentDiv.setAttribute("state", "todo");

document.getElementById("timer").addEventListener("click", function(event){
    if(contentDiv.getAttribute("state") === "timer") return;
    contentDiv.innerHTML='<object type="text/html" data="timer/timer.html" width="730px" height="550px"></object>';
    contentDiv.setAttribute("state", "timer");
});

document.getElementById("todo").addEventListener("click", function(event){
    if(contentDiv.getAttribute("state") === "todo") return;
    contentDiv.innerHTML='<object type="text/html" data="todo-list/todo.html" width="730px" height="550px"></object>';
    contentDiv.setAttribute("state", "todo");
});

document.getElementById("sfl").addEventListener("click", function(event){
    if(contentDiv.getAttribute("state") === "sfl") return;
    contentDiv.innerHTML='<object type="text/html" data="save-for-later/sfl.html" width="730px" height="550px"></object>';
    contentDiv.setAttribute("state", "sfl");
});
