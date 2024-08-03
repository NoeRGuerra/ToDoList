import '../views/style.css';
import { addNewTaskForm, displayTask } from './taskController';
import ToDoList from '../models/ToDoList';
import Task from '../models/Task';
import Step from '../models/Step';

const existingLists = [];
let currentToDoList = null;

function createDefaultList() {
    const todayList = new ToDoList('Today');
    const task1 = new Task('Finish program');
    todayList.addTask(task1);
    existingLists.push(todayList);
}

function addTopLists() {
    createDefaultList();
    const container = document.querySelector("#top-lists");
    const defaultList = existingLists[0];
    const defaultListBtn = document.createElement('button');
    defaultListBtn.textContent = defaultList.name;
    defaultListBtn.addEventListener('click', () => {
        displayToDoList(defaultList);
    });
    const allTasksBtn = document.createElement('button');
    allTasksBtn.textContent = "All tasks";
    allTasksBtn.addEventListener('click', displayAllTasks);
    
    const importantTasksBtn = document.createElement('button');
    importantTasksBtn.textContent = 'Important tasks';
    importantTasksBtn.addEventListener('click', displayImportantTasks);
    container.append(defaultListBtn, document.createElement('br'), allTasksBtn, document.createElement('br'), importantTasksBtn);
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

    ToDoList.listOfTasks.forEach((task, index) => {
        displayTask(task, ToDoList, index);
    })
    addNewTaskForm(ToDoList);
    setCurrentToDoList(ToDoList);
}

function displayAllTasks(){
    clearDisplayedToDoList();
    const tasksContainer = document.querySelector('.right');
    const header = document.createElement('h2');
    header.textContent = "All tasks"
    tasksContainer.appendChild(header);
    existingLists.forEach((list, i) => {
        list.listOfTasks.forEach((task, j) => {
            displayTask(task, list, (i * 10) + j);
        })
    })
}

function displayImportantTasks(){
    clearDisplayedToDoList();
    const tasksContainer = document.querySelector('.right');
    const header = document.createElement('h2');
    header.textContent = "Important tasks";
    tasksContainer.append(header);
    existingLists.forEach((list, i) => {
        list.listOfTasks.forEach((task, j) => {
            if (task.isImportant) {
                displayTask(task, list, (i * 10) + j);
            }
        })
    })
}

export {
    addTopLists,
    displayToDoList,
    createDemoLists,
    populateListsContainer,
    displayAllTasks,
    existingLists,
    currentToDoList
};