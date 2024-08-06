import ToDoList from "../models/ToDoList";

function saveToDoLists(toDoLists){
    localStorage.setItem('ToDoLists', JSON.stringify(toDoLists));
}

function loadToDoLists(){
    const toDoListsData = localStorage.getItem('ToDoLists');
    const todoLists = [];
    if (!toDoListsData){
        return todoLists;
    }
    const toDoListsDataParsed = JSON.parse(toDoListsData);
    toDoListsDataParsed.forEach(todoListObj => {
        const todoList = ToDoList.fromObject(todoListObj);
        todoLists.push(todoList);
    });
    return todoLists;
}

export {
    saveToDoLists,
    loadToDoLists,
}