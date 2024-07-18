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
        taskTask.markNotImportant();
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
    const removeTaskBtn = document.createElement('button');
    const markImportantTaskBtn = document.createElement('button');
    const showStepsBtn = document.createElement('button');
    const label = document.createElement('label');
    const br = document.createElement('br');
    checkbox.type = 'checkbox';
    checkbox.id = index;
    checkbox.value = Task.name;
    checkbox.setAttribute('data-list', ToDoList.name)
    label.htmlFor = index;
    label.textContent = Task.name;
    removeTaskBtn.textContent = '❌';
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
        markTaskAsImportant(Task);
        markImportantTaskBtn.textContent = Task.isImportant ? '🟨' : '🔳';
    });
    showStepsBtn.textContent = "🔽";
    showStepsBtn.addEventListener('click', () => {
        displaySteps(Task, taskContainer);
    });
    taskContainer.appendChild(checkbox);
    taskContainer.appendChild(label);
    taskContainer.appendChild(removeTaskBtn);
    taskContainer.appendChild(markImportantTaskBtn);
    if (Task.steps.length > 0){
        taskContainer.appendChild(showStepsBtn);
    }
    taskContainer.appendChild(br);
    listContainer.appendChild(taskContainer);
}

export { 
    addNewTaskForm,
    markTaskAsImportant,
    displaySteps,
    displayTask
};