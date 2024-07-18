import Task from './Task';

class ToDoList {
    /**
     * Create a To-Do List.
     * @param {string} name - Name of the To-Do List.
     */
    constructor(name) {
        this.name = name;
        this.listOfTasks = [];
    }

    /**
     * Add a task to the To-Do List.
     * @param {Task} task 
     * @throws {Error} Will throw an error if the step is not an instance of Step.
     */
    addTask(task) {
        if (!(task instanceof Task)){
            throw new Error('Invalid Task: Must be an instance of Task');
        }
        this.listOfTasks.push(task);
    }

    /**
     * Remove a task from the To-Do List.
     * @param {string} taskName - The name of the task to remove.
     */
    removeTask(index) {
        if (index < 0 || index >= this.listOfTasks.length) {
            throw new Error('Invalid Index: Index out of range');
        }
        this.listOfTasks.splice(index, 1);    
    }
}

export default ToDoList;