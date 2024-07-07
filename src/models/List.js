const Task = require('./Task');

export class List {
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
    removeTask(taskName) {
        this.listOfTasks = this.listOfTasks.filter(task => task.name !== taskName);
    }

    /**
     * Print the contents of the To-Do List to console.
     */
    printList() {
        const nameLength = this.name.length;
        const taskLengths = this.listOfTasks.map(task => task.name.length);
        const stepLengths = this.listOfTasks.flatMap(task => task.steps.map(step => step.name.length));
        const maxLength = Math.max(nameLength, ...taskLengths, ...stepLengths);
    
        const border = '+-' + '-'.repeat(maxLength) + '-+';
        const pad = (str) => str + ' '.repeat(maxLength - str.length);
    
        console.log(border);
        console.log(`| ${pad(this.name)} |`);
        console.log(border);
    
        this.sortTasks();
        this.listOfTasks.forEach(task => {
          console.log(`| ${pad(task.name)} |`);
          task.steps.forEach(step => {
            console.log(`| - ${pad(step.name)} |`);
          });
          console.log(border);
        });
      }
}