import Step from './Step';

class Task {
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
        this.createdAt = null;
        this.completedAt = null;
        this.#setcreatedAt();
        this.#setcompletedAt();
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
    removeStep(index) {
        if (index < 0 || index>=this.steps.length) {
            throw new Error('Invalid Index: Index out of range');
        }
        this.steps.splice(index, 1);
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
        this.#setcompletedAt();
    }

    /**
     * Mark task as incomplete.
     */
    markIncomplete() {
        this.isComplete = false;
        this.#setcompletedAt();
    }

    markImportant() {
        this.isImportant = true;
    }

    markNotImportant() {
        this.isImportant = false;
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

    /**
     * Create a Task instance from a plain object.
     * @param {Object} obj - The object to create a Task from.
     * @returns {Task} - The created Task instance.
     */
    static fromObject(obj){
        const task = new Task(obj.name, obj.dueDate, obj.isImportant);
        task.description = obj.description;
        task.isComplete = obj.isComplete;
        obj.steps.forEach(stepObj => {
            const step = Step.fromObject(stepObj);
            task.addStep(step);
        });
        task.createdAt = obj.createdAt;
        if (task.isComplete && !task.completedAt){
            task.#setcompletedAt();
        }
        return task;
    }

    #setcreatedAt() {
        if (!this.createdAt){
            this.createdAt = new Date();
        }
    }

    #setcompletedAt() {
        if (this.isComplete){
            this.completedAt = new Date();
        }
    }
}

export default Task;