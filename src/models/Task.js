const Step = require('./Step');

export class Task {
    /**
     * Create a Task to add to a To-Do List.
     * @param {string} name - The name of the Task.
     * @param {string} dueDate - Due date of the task.
     * @param {boolean} isImportant - 
     */
    constructor(name, dueDate=null, isImportant=false) {
        this.name = name;
        this.description = '';
        this.dueDate = dueDate;
        this.isImportant = isImportant;
        this.steps = [];
        this.isComplete = false;
    }

    /**
     * Add a step to the task.
     * @param {Step} step
     * @throws {Error} Will throw an error if the step is not an instance of Step.
     */
    addStep(step) {
        if (!(step instanceof Step)){
            throw new Error('Invalid step: Must be an instance of Step');
        }
        this.steps.push(step);
    }

    /**
     * Remove a step from the task.
     * @param {string} stepName - The name of the step to remove
     */
    removeStep(stepName) {
        this.steps = this.steps.filter(step => step.name !== stepName);
    }

    /**
     * Check if all steps are complete.
     */
    checkCompletion() {
        this.isComplete = this.steps.every(step => step.isComplete);
    }

    /**
     * Mark task as complete.
     */
    markComplete() {
        this.isComplete = true;
    }

    /**
     * Mark task as incomplete.
     */
    markIncomplete() {
        this.isComplete = false;
    }

    /**
     * Set a due date for the task.
     * @param {string} dueDate 
     */
    setDueDate(dueDate) {
        this.dueDate = dueDate;
    }

    /**
     * Set a description for the task.
     * @param {string} description 
     */
    setDescription(description) {
        this.description = description;
    }
}