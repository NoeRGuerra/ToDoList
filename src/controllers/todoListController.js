import '../views/style.css';
import { addNewTaskForm } from './taskController';
const ToDoList = require('../models/ToDoList');
const Task = require('../models/Task');
const Step = require('../models/Step');

const existingLists = [];
let currentToDoList = null;

function createDefaultList() {
    const todayList = new ToDoList('Today');
    existingLists.push(todayList);
}

function addDefaultList() {
    createDefaultList();
    const defaultList = existingLists[0];
    const container = document.querySelector("#top-lists");
    const listItem = document.createElement('button');
    listItem.textContent = defaultList.name;
    listItem.addEventListener('click', () => {
        displayToDoList(defaultList);
    });
    container.appendChild(listItem);
}

function createDemoLists() {
    const cleanKitchenList = new ToDoList('Clean Kitchen');

    // Create tasks for the "Clean Kitchen" list
    const task1 = new Task('Wash dishes');
    task1.addStep(new Step('Gather all dishes'));

    const task2 = new Task('Sweep floor');
    task2.addStep(new Step('Sweep entire kitchen floor'));

    const task3 = new Task('Mop the kitchen');
    task3.addStep(new Step('Mop with soapy water'));

    cleanKitchenList.addTask(task1);
    cleanKitchenList.addTask(task2);
    cleanKitchenList.addTask(task3);

    // Create a new to-do list for "Clean Room"
    const cleanRoomList = new ToDoList('Clean Room');

    // Create tasks for the "Clean Room" list
    const task4 = new Task('Organize desk');
    const task5 = new Task('Vacuum carpet');
    task5.addStep(new Step('Vacuum the entire carpet'));

    cleanRoomList.addTask(task4);
    cleanRoomList.addTask(task5);

    // Create a new to-do list for "Get groceries"
    const getGroceriesList = new ToDoList('Get Groceries');

    // Create tasks for the "Get Groceries" list
    const task6 = new Task('Buy milk');
    const task7 = new Task('Buy eggs');
    const task8 = new Task('Buy bread');
    const task9 = new Task('Buy vegetables');
    const task10 = new Task('Buy fruit');

    getGroceriesList.addTask(task6);
    getGroceriesList.addTask(task7);
    getGroceriesList.addTask(task8);
    getGroceriesList.addTask(task9);
    getGroceriesList.addTask(task10);

    existingLists.push(cleanKitchenList);
    existingLists.push(cleanRoomList);
    existingLists.push(getGroceriesList);
}

function populateListsContainer() {
    const listsContainer = document.querySelector("#lists");
    for (let list of existingLists.slice(1)) {
        const listParagraph = document.createElement('button');
        const br = document.createElement('br');
        listParagraph.textContent = list.name;
        listsContainer.appendChild(listParagraph);
        listsContainer.appendChild(br);
        listParagraph.addEventListener('click', () => {
            displayToDoList(list);
        });
    }
    addNewListForm();
}

function addNewListForm() {
    const container = document.querySelector("#lists");
    const newListForm = document.createElement('form');
    const newListInput = document.createElement('input');
    newListInput.type = 'text';
    newListInput.placeholder = "New List";
    const newListSubmit = document.createElement('input');
    newListSubmit.type = 'submit';
    newListSubmit.value = "+";
    newListForm.appendChild(newListSubmit);
    newListForm.appendChild(newListInput);
    container.appendChild(newListForm);

    newListSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        const newListName = newListInput.value;
        const newList = new ToDoList(newListName);
        existingLists.push(newList);
        clearAllLists();
        populateListsContainer();
    });
}

function clearAllLists() {
    const listsContainer = document.querySelector("#lists");
    listsContainer.replaceChildren();
}

function clearDisplayedToDoList() {
    const rightDiv = document.querySelector(".right");
    rightDiv.replaceChildren();
}

function setCurrentToDoList(ToDoList) {
    currentToDoList = ToDoList;
}

function getCurrentToDoList() {
    return currentToDoList;
}

function displayToDoList(ToDoList, clear=true, title=true) {
    if (clear)
        clearDisplayedToDoList();
    const rightDiv = document.querySelector(".right");
    if (title){
        const header = document.createElement('h2');
        header.textContent = ToDoList.name;
        rightDiv.appendChild(header);
    }

    for (let task of ToDoList.listOfTasks) {
        displayTask(task, ToDoList);
    }
    addNewTaskForm(ToDoList);
    setCurrentToDoList(ToDoList);
}

function displayTask(Task, ToDoList){
    const index = document.querySelectorAll(`.right>div>input[data-list="${ToDoList.name}"]`).length;
    const listContainer = document.querySelector(".right");
    const taskContainer = document.createElement('div');
    const checkbox = document.createElement('input');
    const removeTaskBtn = document.createElement('button');
    const markImportantTaskBtn = document.createElement('button');
    const label = document.createElement('label');
    const br = document.createElement('br');
    checkbox.type = 'checkbox';
    checkbox.id = index;
    checkbox.value = Task.name;
    checkbox.setAttribute('data-list', ToDoList.name)
    label.htmlFor = index;
    label.textContent = Task.name;
    removeTaskBtn.textContent = '-';
    removeTaskBtn.addEventListener('click', () => {
        ToDoList.removeTask(index);
        let totalTasks = document.querySelectorAll(`.right>div>input[data-list]`).length;
        let listTasks = document.querySelectorAll(`.right>div>input[data-list="${ToDoList.name}"]`).length;
        if (totalTasks != listTasks){
            displayAllTasks();
        } else {
            displayToDoList(ToDoList);
        }
    });
    markImportantTaskBtn.textContent = Task.isImportant ? '🟨' : '🔳';
    markImportantTaskBtn.addEventListener('click', () => {
        if (Task.isImportant) {
            Task.markNotImportant();
        } else {
            Task.markImportant();
        }
        markImportantTaskBtn.textContent = Task.isImportant ? '🟨' : '🔳';
    });
    taskContainer.appendChild(checkbox);
    taskContainer.appendChild(label);
    taskContainer.appendChild(removeTaskBtn);
    taskContainer.appendChild(markImportantTaskBtn);
    taskContainer.appendChild(br);
    listContainer.appendChild(taskContainer);
}

function addAllTasks() {
    const container = document.querySelector("#top-lists");
    const listItem = document.createElement('button');
    listItem.textContent = "All tasks";
    listItem.addEventListener('click', displayAllTasks);
    container.appendChild(listItem);
}

function displayAllTasks(){
    clearDisplayedToDoList();
    const tasksContainer = document.querySelector('.right');
    const header = document.createElement('h2');
    header.textContent = "All tasks"
    tasksContainer.appendChild(header);
    for (let list of existingLists){
        for (let task of list.listOfTasks){
            displayTask(task, list);
        }
    }
}

export {
    addDefaultList,
    addAllTasks,
    displayToDoList,
    createDemoLists,
    populateListsContainer,
    existingLists
}