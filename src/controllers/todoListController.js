import '../views/style.css';
import { addNewTaskForm, closeSidebar, createTaskContainer, createButton } from './taskController';
import ToDoList from '../models/ToDoList';
import Task from '../models/Task';
import Step from '../models/Step';
import { saveToDoLists, loadToDoLists } from '../utils/storage';
import houseIcon from "../views/icons/house-solid.svg";
import allBorderIcon from "../views/icons/border-all-solid.svg";
import barsIcon from "../views/icons/bars-solid.svg";
import starIcon from "../views/icons/star-solid-white.svg";

const existingLists = loadToDoLists();
let currentToDoList = null;
let currentIndex = null;
let listType = null; // 0 - Regular, 1 - All tasks, 2 - Important

function createDefaultList() {
    const todayList = new ToDoList('Today');
    const task1 = new Task('Finish program');
    todayList.addTask(task1);
    existingLists.push(todayList);
}

function addTopLists() {
    if (existingLists.length === 0){
        createDefaultList();
    }
    const container = document.querySelector("#top-lists");
    const defaultList = existingLists[0];
    const defaultListContainer = document.createElement('div');
    defaultListContainer.setAttribute('data-todolist-index', 0);
    const defaultListBtn = createButton(defaultList.name, showDefaultList);
    const defaultListIcon = document.createElement('img');
    defaultListIcon.src = houseIcon;
    defaultListIcon.className = "icon";
    defaultListBtn.prepend(defaultListIcon);
    defaultListContainer.append(defaultListBtn);

    const allTasksContainer = document.createElement('div');
    const allTasksBtn = createButton("All tasks", displayAllTasks);
    const allTasksIcon = document.createElement('img');
    allTasksIcon.src = allBorderIcon;
    allTasksIcon.className = "icon";
    allTasksBtn.prepend(allTasksIcon);
    allTasksContainer.append(allTasksBtn);
    
    const importantTasksContainer = document.createElement('div');
    const importantTasksBtn = createButton("Important tasks", displayImportantTasks);
    const importantTasksIcon = document.createElement('img');
    importantTasksIcon.src = starIcon;
    importantTasksIcon.className = "icon";
    importantTasksBtn.prepend(importantTasksIcon);
    importantTasksContainer.append(importantTasksBtn);
    container.append(defaultListContainer, allTasksContainer, importantTasksContainer);
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
    existingLists.slice(1).forEach((list, index) => {
        const todoListContainer = document.createElement('div');
        const listBtn = createButton(list.name, () => {
            currentIndex = index+1;
            displayToDoList(list);
        });
        const listIcon = document.createElement('img');
        listIcon.src = barsIcon;
        listIcon.className = "icon";
        listBtn.prepend(listIcon);
        todoListContainer.setAttribute('data-todolist-index', index+1);
        todoListContainer.append(listBtn);
        listsContainer.appendChild(todoListContainer);
    })
    addNewListForm();
}

function addNewListForm() {
    const container = document.querySelector("#lists");
    const newListForm = document.createElement('form');
    newListForm.className = "new-list-form";
    const newListInput = document.createElement('input');
    newListInput.type = 'text';
    newListInput.placeholder = "New List";
    newListInput.maxLength = 30;
    const newListSubmit = document.createElement('input');
    newListSubmit.type = 'submit';
    newListSubmit.value = "+";
    
    newListSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        const newListName = newListInput.value;
        const newList = new ToDoList(newListName);
        existingLists.push(newList);
        clearAllLists();
        populateListsContainer();
        saveToDoLists(existingLists);
    });

    const messageSpan = document.createElement('span');
    messageSpan.className = 'char-limit-message';
    messageSpan.textContent = `List names cannot be longer than ${newListInput.maxLength} characters`;
    
    newListInput.addEventListener('input', () => {
        if (newListInput.value.length >= newListInput.maxLength) {
            messageSpan.style.display = 'inline';
        } else {
            messageSpan.style.display = 'none';
        }
    })
    newListForm.append(newListSubmit, newListInput);
    container.append(newListForm, messageSpan);
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

function displayToDoList(ToDoList, disableNewTaskForm=false) {
    if (currentToDoList !== ToDoList){
        closeSidebar();
    }
    listType = 0;
    clearDisplayedToDoList();
    setCurrentToDoList(ToDoList);
    const rightDiv = document.querySelector(".right");
    const headerContainer = currentIndex === 0 ? createHeaderElement(ToDoList.name, false) : createHeaderElement(ToDoList.name, true);
    const tasksContainer = document.createElement('div');
    const pendingTasksContainer = document.createElement('div');
    const completedTasksContainer = document.createElement('div');
    const completedTag = document.createElement('span');
    completedTag.textContent = "Completed";
    completedTag.classList.add("completed-tag", "inactive");
    completedTag.addEventListener('click', () => {
        completedTasksContainer.classList.toggle('inactive');
    })
    rightDiv.append(headerContainer);
    ToDoList.listOfTasks.forEach((task, taskIndex) => {
        const taskId = `list-1-task-${taskIndex}`;
        const taskContainer = createTaskContainer(task, ToDoList, taskId);
        taskContainer.className = 'task-item';
        taskContainer.setAttribute(`data-task-index`, taskIndex);
        if (!task.isComplete){
            pendingTasksContainer.append(taskContainer);
        } else {
            completedTasksContainer.append(taskContainer);
        }
    });
    tasksContainer.append(pendingTasksContainer, completedTag);
    tasksContainer.className = "tasks";
    if (completedTasksContainer.childElementCount > 1){
        completedTag.textContent = `Completed ${completedTasksContainer.childElementCount}`;
        completedTag.classList.remove('inactive');
        tasksContainer.append(completedTasksContainer);
    }
    rightDiv.append(tasksContainer);
    if (!disableNewTaskForm){
        addNewTaskForm(ToDoList);
    }
}

function createHeaderElement(title, enableDelete=true){
    const headerContainer = document.createElement('div');
    headerContainer.id = "list-header";
    const heading = document.createElement('h2');
    heading.textContent = title;
    heading.className = "list-name";
    headerContainer.appendChild(heading);
    if (!enableDelete){
        return headerContainer;
    }
    const deleteBtn = createButton('', () => {
        confirmAction("Are you sure you want to delete this list?", removeToDoList);
    });
    deleteBtn.classList.add('delete');
    headerContainer.append(deleteBtn);
    return headerContainer;
}

function displayAllTasks(){
    if (listType !== 1){
        closeSidebar();
    }
    listType = 1;
    clearDisplayedToDoList();
    const container = document.querySelector('.right');
    const heading = createHeaderElement("All tasks", false);
    const allTasksContainer = document.createElement('div');
    allTasksContainer.className = "tasks";
    existingLists.forEach((todoList, index) => {
        const currentListContainer = document.createElement('div');
        currentListContainer.textContent = todoList.name;
        currentListContainer.setAttribute('data-list-index', index);
        todoList.listOfTasks.forEach((task, taskIndex) => {
            if (task.isComplete){
                return;
            }
            const taskId = `list-${index}-task-${taskIndex}`;
            const taskContainer = createTaskContainer(task, todoList, taskId);
            taskContainer.className = "task-item";
            taskContainer.setAttribute('data-task-index', taskIndex);
            currentListContainer.append(taskContainer);
        });
        allTasksContainer.append(currentListContainer);
    });
    container.append(heading, allTasksContainer);
}


function displayImportantTasks(){
    if (listType !== 2){
        closeSidebar();
    }
    listType = 2;
    clearDisplayedToDoList();
    const container = document.querySelector('.right');
    const heading = createHeaderElement("Important tasks", false);
    const allTasksContainer = document.createElement('div');
    allTasksContainer.className = "tasks";
    existingLists.forEach((todoList, index) => {
        const currentListContainer = document.createElement('div');
        currentListContainer.setAttribute('data-list-index', index);
        todoList.listOfTasks.forEach((task, taskIndex) => {
            if (!task.isImportant){
                return;
            }
            const taskId = `list-${index}-task-${taskIndex}`;
            const taskContainer = createTaskContainer(task, todoList, taskId);
            taskContainer.className = "task-item";
            taskContainer.setAttribute('data-task-index', taskIndex);
            currentListContainer.append(taskContainer);
        });
        if (currentListContainer.hasChildNodes()){
            allTasksContainer.append(currentListContainer);
        }
    });
    container.append(heading, allTasksContainer);
}

function removeToDoList(){
    const listsContainer = document.querySelector('#lists');
    const listElement = listsContainer.querySelector(`div[data-todolist-index="${currentIndex}"]`);
    listsContainer.removeChild(listElement);
    existingLists.splice(currentIndex, 1);
    showDefaultList();
    saveToDoLists(existingLists);
}

function showDefaultList(){
    currentIndex = 0;
    displayToDoList(existingLists[0]);
}

function confirmAction(text, onClick){
    const listContainer = document.querySelector('.homepage');
    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'overlay';
    const warningContainer = document.createElement('div');
    warningContainer.className = 'popup';
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    const okBtn = createButton('Continue', () => {
        onClick();
        removePopup();
    }); 
    const cancelBtn = createButton('Cancel', () => {
        removePopup();
    });
    warningContainer.append(paragraph, okBtn, cancelBtn);
    overlayContainer.append(warningContainer);
    listContainer.append(overlayContainer);
}

function removePopup(){
    const popup = document.querySelector('.popup');
    const overlay = document.querySelector('.overlay');
    const container = document.querySelector('.homepage');
    overlay.removeChild(popup)
    container.removeChild(overlay);
}

export {
    addTopLists,
    displayToDoList,
    createDemoLists,
    populateListsContainer,
    displayAllTasks,
    displayImportantTasks,
    existingLists,
    currentToDoList,
    confirmAction,
    setCurrentToDoList,
    listType,
    showDefaultList
};