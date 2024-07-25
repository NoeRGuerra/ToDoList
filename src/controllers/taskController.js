import task from "../models/Task";
import { displayToDoList, displayAllTasks } from './todoListController';

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
        const newTask = new task(newTaskName);
        ToDoList.listOfTasks.push(newTask);
        displayToDoList(ToDoList);
    })
}

function markTaskAsImportant(task){
    if (task.isImportant) {
        task.markNotImportant();
    } else {
        task.markImportant();
    }
}

function displaySteps(task, taskContainer){
    const stepsContainer = document.createElement('div');
    const br = document.createElement('br');
    for (let step of task.steps){
        const icon = document.createElement('span');
        const stepIndex = taskContainer.querySelectorAll('data-task').length;
        const stepCheckbox = document.createElement('input');
        const stepLabel = document.createElement('label');
        stepCheckbox.type = 'checkbox';
        stepCheckbox.id = stepIndex;
        stepCheckbox.value = step.name;
        stepCheckbox.setAttribute('data-task', task.name);
        stepLabel.htmlFor = stepIndex;
        stepLabel.textContent = step.name;
        icon.textContent = '· ';
        stepsContainer.appendChild(icon);
        stepsContainer.appendChild(stepCheckbox);
        stepsContainer.appendChild(stepLabel);
        stepsContainer.appendChild(br);
    }
    taskContainer.appendChild(stepsContainer);
}

function displayTask(Task, ToDoList){
    const index = document.querySelectorAll(`.right>div>input[data-list="${ToDoList.name}"]`).length;
    const listContainer = document.querySelector(".right");
    const taskContainer = document.createElement('div');
    const checkbox = document.createElement('input');
    const markImportantTaskBtn = document.createElement('button');
    const label = document.createElement('label');
    const br = document.createElement('br');
    checkbox.type = 'checkbox';
    checkbox.id = index;
    checkbox.value = Task.name;
    checkbox.setAttribute('data-list', ToDoList.name)
    label.htmlFor = index;
    label.textContent = Task.name;
    markImportantTaskBtn.textContent = Task.isImportant ? '🟨' : '🔳';
    markImportantTaskBtn.addEventListener('click', () => {
        markTaskAsImportant(Task);
        markImportantTaskBtn.textContent = Task.isImportant ? '🟨' : '🔳';
    });
    label.addEventListener('click', (e) => {
        e.preventDefault();
        openTaskSidebar(Task, ToDoList, index);
    })
    taskContainer.appendChild(checkbox);
    taskContainer.appendChild(label);
    taskContainer.appendChild(markImportantTaskBtn);
    taskContainer.appendChild(br);
    listContainer.appendChild(taskContainer);
}

function openTaskSidebar(Task, ToDoList, index){
    closeSidebar();
    const parentContainer = document.querySelector(".homepage");
    const sidebarContainer = document.createElement('div');
    sidebarContainer.classList.add('sidebar-display');
    const taskHeaderContainer = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'task';
    checkbox.value = Task.name;
    const taskTitle = document.createElement('label');
    taskTitle.htmlFor = 'task';
    const markImportantTaskBtn = document.createElement('button');
    markImportantTaskBtn.textContent = Task.isImportant ? '🟨' : '🔳';
    markImportantTaskBtn.addEventListener('click', () => {
        markTaskAsImportant(Task);
        markImportantTaskBtn.textContent = Task.isImportant ? '🟨' : '🔳';
    });
    const closeSidebarBtn = document.createElement('button');
    closeSidebarBtn.textContent = "Close";
    closeSidebarBtn.addEventListener('click', closeSidebar);
    const deleteTaskBtn = document.createElement('button');
    deleteTaskBtn.textContent = '❌';
    deleteTaskBtn.addEventListener('click', () => {
        closeSidebar();
        ToDoList.removeTask(index);
        refreshList(ToDoList);
    });
    taskTitle.textContent = Task.name;
    taskHeaderContainer.appendChild(checkbox);
    taskHeaderContainer.appendChild(taskTitle);
    taskHeaderContainer.appendChild(markImportantTaskBtn);
    sidebarContainer.appendChild(taskHeaderContainer);
    displaySteps(Task, sidebarContainer);
    sidebarContainer.appendChild(closeSidebarBtn);
    sidebarContainer.appendChild(deleteTaskBtn);
    parentContainer.appendChild(sidebarContainer);
    parentContainer.classList.toggle('sidebar-active');
}

function refreshList(ToDoList){
    let totalTasks = document.querySelectorAll(`.right>div>input[data-list]`).length;
    let listTasks = document.querySelectorAll(`.right>div>input[data-list="${ToDoList.name}"]`).length;
    if (totalTasks != listTasks){
        displayAllTasks();
    } else {
        displayToDoList(ToDoList);
    }
}

function closeSidebar(){
    const parentContainer = document.querySelector('.homepage');
    const sidebarContainer = document.querySelector('.sidebar-display');
    if (sidebarContainer === null){
        return;
    }
    parentContainer.removeChild(sidebarContainer);
    parentContainer.classList.toggle('sidebar-active');
}

export { 
    addNewTaskForm,
    markTaskAsImportant,
    displaySteps,
    displayTask
};