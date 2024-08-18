import Step from "../models/Step";
import Task from "../models/Task";
import { displayToDoList, displayAllTasks, currentToDoList, existingLists } from './todoListController';
import { saveToDoLists } from "../utils/storage";
import { format } from "date-fns";

let currentTask = null;

function addNewTaskForm(ToDoList) {
    const container = document.querySelector(".right");
    const newTaskForm = createNewTaskForm();
    container.appendChild(newTaskForm);

    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTaskName = newTaskForm.querySelector('input[type="text"]').value;
        const newTask = new Task(newTaskName);
        ToDoList.listOfTasks.push(newTask);
        saveToDoLists(existingLists);
        displayToDoList(ToDoList);
    });
}

function addNewStepForm(Task, ToDoList, index) {    
    const newStepForm = createNewTaskForm();
    newStepForm.className = "new-step-form";
    const newStepInput = newStepForm.querySelector('input[type="text"]');
    newStepInput.placeholder = "Next Step";
    newStepForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newStepName = newStepInput.value;
        const newStep = new Step(newStepName);
        console.log(Task);
        console.log(existingLists);
        Task.addStep(newStep);
        saveToDoLists(existingLists);
        openTaskSidebar(currentTask, ToDoList, index);
    });
    return newStepForm;
}

function createNewTaskForm(){
    const newTaskForm = document.createElement('form');
    newTaskForm.className = "new-task-form";
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
    saveToDoLists(existingLists);
}

function markTaskAsComplete(task){
    if (task.isComplete) {
        task.markIncomplete();
    } else {
        task.markComplete();
    }
    if (task instanceof Step){
        currentTask.checkCompletion();
    }
    saveToDoLists(existingLists);
}

function displaySteps(task, taskContainer){
    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('sidebar-steps');
    task.steps.forEach((step, index) => {
        const stepElement = createStepElement(step, index, task.name);
        stepsContainer.appendChild(stepElement);
    });
    taskContainer.appendChild(stepsContainer);
}

function createStepElement(step, index){
    const icon = document.createElement('span');
    icon.textContent = '· ';
    const stepID = `sidebar-step-${index}`;
    const stepCheckbox = createCheckbox(step, stepID, currentToDoList);
    const stepLabel = document.createElement('label');
    stepLabel.htmlFor = stepID;
    stepLabel.textContent = step.name;
    const br = document.createElement('br');
    const deleteBtn = createButton('❌', () => {
        const parentContainer = document.querySelector('.sidebar-steps');
        const stepIndex = parseInt(stepElement.getAttribute('data-step-index'));
        currentTask.removeStep(stepIndex);
        parentContainer.removeChild(stepElement);
        saveToDoLists(existingLists);
    });
    const stepElement = document.createElement('div');
    stepElement.setAttribute('data-step-index', index);
    stepElement.append(icon, stepCheckbox, stepLabel, deleteBtn, br);
    return stepElement;
}

function displayTask(Task, ToDoList, index){
    const listContainer = document.querySelector(".right");
    const taskContainer = createTaskContainer(Task, ToDoList, index);
    taskContainer.className = "task-item";
    listContainer.appendChild(taskContainer);
}

function createTaskContainer(Task, ToDoList, index){
    const taskContainer = document.createElement('div');
    const checkbox = createCheckbox(Task, index, ToDoList);
    const label = createLabel(Task.name, index);
    const markImportantTaskBtn = createMarkImportantButton(Task, ToDoList, index);
    label.addEventListener('click', (e) => {
        e.preventDefault();
        currentTask = Task;
        if (document.querySelector('.sidebar-display')){
            closeSidebar();
        } else {
        openTaskSidebar(Task, ToDoList, index);
        }
    })
    taskContainer.append(checkbox, label, markImportantTaskBtn, document.createElement('br'));
    return taskContainer;
}

function createCheckbox(task, index, ToDoList){
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = index;
    checkbox.value = task.name;
    checkbox.setAttribute('data-list', ToDoList.name);
    if (task.isComplete){
        checkbox.checked = true;
    }
    checkbox.addEventListener('change', () => {
        markTaskAsComplete(task);
        if (document.querySelector('.sidebar-display')){
            openTaskSidebar(currentTask, ToDoList, index);
            refreshList(ToDoList);
        }
    })
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
        saveToDoLists(existingLists);
        refreshList(ToDoList);
    });
    const descriptionBox = createDescriptionBox(Task);
    const newStepForm = addNewStepForm(Task, ToDoList, index);
    sidebarContainer.append(sidebarHeaderContainer);
    displaySteps(Task, sidebarContainer);
    const datePickerBtn = createDueDateBtn(Task, sidebarContainer);
    datePickerBtn.id = "dueDateBtn";
    sidebarContainer.append(newStepForm, document.createElement('br'), datePickerBtn, document.createElement('br'), 
                            descriptionBox, document.createElement('br'), closeSidebarBtn, deleteTaskBtn);
    return sidebarContainer;
}

function createDueDateBtn(Task, sidebarContainer){
    const existingDatePicker = sidebarContainer.querySelector('input[type=date]');
    if (existingDatePicker){
        sidebarContainer.removeChild(existingDatePicker);
    }
    const btn = createButton('Add due date', () => {
        sidebarContainer.removeChild(btn);
        const datePicker =  createDatePicker(Task, sidebarContainer);
        const previousLinebreak = sidebarContainer.querySelector('br:nth-of-type(2)');
        sidebarContainer?.insertBefore(datePicker, previousLinebreak);
        datePicker.focus();
        datePicker.showPicker();
    });
    return btn;
}

function createDatePicker(Task, sidebarContainer){
    const datePicker = document.createElement('input');
    datePicker.type = 'date';
    datePicker.addEventListener('click', datePicker.showPicker);
    datePicker.addEventListener('focusout', () => {
        try{
            const [year, month, day] = datePicker.value.split('-').map(Number);
            const localDate = new Date(year, month-1, day);
            Task.setDueDate(localDate);
            const dueDate = format(Task.dueDate, 'yyyy-MM-dd');
            console.log(dueDate);
            console.log(typeof dueDate);
        } catch (RangeError){
            if (!datePicker.value){
                const dueDateBtn = createDueDateBtn(Task, sidebarContainer);
                dueDateBtn.id = "dueDateBtn";
                const previousLinebreak = sidebarContainer.querySelector('br:nth-of-type(2)');
                sidebarContainer.insertBefore(dueDateBtn, previousLinebreak);
            }
            console.log("Invalid date");
        }
    })
    return datePicker;
}

function createDescriptionBox(Task){
    const descriptionBox = document.createElement('textarea');
    if (Task.description == ''){
        descriptionBox.placeholder = "Add description...";
    } else {
        descriptionBox.value = Task.description;
    }
    descriptionBox.addEventListener('focusout', () => {
        Task.setDescription(descriptionBox.value);
        saveToDoLists(existingLists);
    });
    return descriptionBox;
}

function createSidebarHeaderContainer(Task, ToDoList, index){
    const sidebarHeaderContainer = document.createElement('div');
    sidebarHeaderContainer.classList.add('sidebar-header');
    const checkbox = createCheckbox(Task, 'sidebar-task-complete', ToDoList);
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
    displayTask,
    closeSidebar,
    createButton
};