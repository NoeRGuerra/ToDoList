import Task from "../models/Task";
import { displayToDoList, displayAllTasks } from './todoListController';

function addNewTaskForm(ToDoList) {
    const container = document.querySelector(".right");
    const newTaskForm = createNewTaskForm();
    container.appendChild(newTaskForm);

    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTaskName = newTaskForm.querySelector('input[type="text"]').value;
        const newTask = new Task(newTaskName);
        ToDoList.listOfTasks.push(newTask);
        displayToDoList(ToDoList);
    });
}

function createNewTaskForm(){
    const newTaskForm = document.createElement('form');
    const newTaskInput = document.createElement('input');
    newTaskInput.type = 'text';
    newTaskInput.placeholder = "New Task";
    const newTaskSubmit = document.createElement('input');
    newTaskSubmit.type = 'submit';
    newTaskSubmit.value = "+";
    newTaskForm.append(newTaskSubmit, newTaskInput);
    return newTaskForm;
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
    task.steps.forEach((step, index) => {
        const stepElement = createStepElement(step, `sidebar-step-${index}`, task.name);
        stepsContainer.appendChild(stepElement);
    });
    taskContainer.appendChild(stepsContainer);
}

function createStepElement(step, index, taskName){
    const icon = document.createElement('span');
    icon.textContent = '· ';
    const stepCheckbox = document.createElement('input');
    stepCheckbox.type = 'checkbox';
    stepCheckbox.id = index;
    stepCheckbox.value = step.name;
    stepCheckbox.setAttribute('data-task', taskName);
    const stepLabel = document.createElement('label');
    stepLabel.htmlFor = index;
    stepLabel.textContent = step.name;
    const br = document.createElement('br');
    const stepElement = document.createElement('div');
    stepElement.append(icon, stepCheckbox, stepLabel, br);
    return stepElement;
}

function displayTask(Task, ToDoList, index){
    const listContainer = document.querySelector(".right");
    const taskContainer = createTaskContainer(Task, ToDoList, index);
    listContainer.appendChild(taskContainer);
}

function createTaskContainer(Task, ToDoList, index){
    const taskContainer = document.createElement('div');
    const checkbox = createCheckbox(Task.name, index, ToDoList.name);
    const label = createLabel(Task.name, index);
    const markImportantTaskBtn = createMarkImportantButton(Task, ToDoList, index);
    label.addEventListener('click', (e) => {
        e.preventDefault();
        openTaskSidebar(Task, ToDoList, index);
    })
    taskContainer.append(checkbox, label, markImportantTaskBtn, document.createElement('br'));
    return taskContainer;
}

function createCheckbox(taskName, index, listName){
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = index;
    checkbox.value = taskName;
    checkbox.setAttribute('data-list', listName);
    return checkbox;    
}

function createLabel(taskName, index){
    const label = document.createElement('label');
    label.htmlFor = index;
    label.textContent = taskName;
    return label;
}

function createMarkImportantButton(Task, ToDoList, index) {
    const markImportantTaskBtn = document.createElement('button');
    markImportantTaskBtn.textContent = Task.isImportant ? '🟨' : '🔳';
    markImportantTaskBtn.addEventListener('click', () => {
        markTaskAsImportant(Task);
        markImportantTaskBtn.textContent = Task.isImportant ? '🟨' : '🔳';
        if (document.querySelector('.sidebar-display')){
            openTaskSidebar(Task, ToDoList, index);
            refreshList(ToDoList);
        }
    });
    return markImportantTaskBtn;
}

function openTaskSidebar(Task, ToDoList, index){
    closeSidebar();
    const parentContainer = document.querySelector(".homepage");
    const sidebarContainer = createSidebarContainer(Task, ToDoList, index);
    parentContainer.appendChild(sidebarContainer);
    parentContainer.classList.toggle('sidebar-active');
}

function createSidebarContainer(Task, ToDoList, index) {
    const sidebarContainer = document.createElement('div');
    sidebarContainer.classList.add('sidebar-display');
    const sidebarHeaderContainer = createSidebarHeaderContainer(Task, ToDoList, index);
    const closeSidebarBtn = createButton('Close', closeSidebar);
    const deleteTaskBtn = createButton('❌', () => {
        closeSidebar();
        ToDoList.removeTask(index);
        refreshList(ToDoList);
    });
    sidebarContainer.append(sidebarHeaderContainer);
    displaySteps(Task, sidebarContainer);
    sidebarContainer.append(closeSidebarBtn, deleteTaskBtn);
    return sidebarContainer;
}

function createSidebarHeaderContainer(Task, ToDoList, index){
    const sidebarHeaderContainer = document.createElement('div');
    const checkbox = createCheckbox(Task.name, 'sidebar-task-complete', ToDoList.name);
    const taskTitle = createLabel(Task.name, 'sidebar-task-complete');
    const markImportantTaskBtn = createMarkImportantButton(Task, ToDoList, index);
    sidebarHeaderContainer.append(checkbox, taskTitle, markImportantTaskBtn);
    return sidebarHeaderContainer;
}

function createButton(text, onClick){
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function refreshList(ToDoList){
    const totalTasks = document.querySelectorAll(`.right>div>input[data-list]`).length;
    const listTasks = document.querySelectorAll(`.right>div>input[data-list="${ToDoList.name}"]`).length;
    if (totalTasks != listTasks){
        displayAllTasks();
    } else {
        displayToDoList(ToDoList);
    }
}

function closeSidebar(){
    const parentContainer = document.querySelector('.homepage');
    const sidebarContainer = document.querySelector('.sidebar-display');
    if (sidebarContainer){
        parentContainer.removeChild(sidebarContainer);
        parentContainer.classList.toggle('sidebar-active');
    }
}

export { 
    addNewTaskForm,
    markTaskAsImportant,
    displaySteps,
    displayTask
};