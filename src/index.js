import './views/style.css';
const ToDoList = require('./models/ToDoList');
const Task = require('./models/Task');
const Step = require('./models/Step');

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

function populateLists() {
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
        clearLists();
        populateLists();
    });
}

function addNewTaskForm() {
    const container = document.querySelector(".right");
    const newTaskForm = document.createElement('form');
    const newTaskInput = document.createElement('input');
    newTaskInput.type = 'text';
    newTaskInput.placeholder = "New List";
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
        currentToDoList.listOfTasks.push(newTask);
        displayToDoList(currentToDoList);
    })
}

function clearLists() {
    const listsContainer = document.querySelector("#lists");
    listsContainer.replaceChildren();
}

function clearToDoList() {
    const rightDiv = document.querySelector(".right");
    rightDiv.replaceChildren();
}

function displayToDoList(ToDoList) {
    clearToDoList();
    console.log(ToDoList);
    const rightDiv = document.querySelector(".right");
    const header = document.createElement('h2');
    header.textContent = ToDoList.name;
    rightDiv.appendChild(header);

    for (let i = 0; i < ToDoList.listOfTasks.length; i++ ) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = i;
        checkbox.name = i;
        checkbox.value = i;
        const label = document.createElement('label');
        label.htmlFor = i;
        label.textContent = ToDoList.listOfTasks[i].name;
        const br = document.createElement('br');
        rightDiv.appendChild(checkbox);
        rightDiv.appendChild(label);
        rightDiv.appendChild(br);
    }
    addNewTaskForm();
    currentToDoList = ToDoList;
}


addDefaultList();
createDemoLists();
populateLists();
displayToDoList(existingLists[0]);