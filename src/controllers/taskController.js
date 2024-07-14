import Task from "../models/Task";
import { displayToDoList } from './todoListController';

function addNewTaskForm(ToDoList) {
    const container = document.querySelector(".right");
    const newTaskForm = document.createElement('form');
    const newTaskInput = document.createElement('input');
    newTaskInput.type = 'text';
    newTaskInput.placeholder = "New Task";
    const newTaskSubmit = document.createElement('input');
    newTaskSubmit.type = 'submit';
    newTaskSubmit.value = "+";
    newTaskForm.appendChild(newTaskSubmit);
    newTaskForm.appendChild(newTaskInput);
    container.appendChild(newTaskForm);

    newTaskSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        const newTaskName = newTaskInput.value;
        const newTask = new Task(newTaskName);
        ToDoList.listOfTasks.push(newTask);
        displayToDoList(ToDoList);
    })
}

export { addNewTaskForm };