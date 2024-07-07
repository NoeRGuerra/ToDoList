export class Step {
    /**
     * Create a Step to add to a Task.
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
        this.isComplete = false;
    }

    /**
     * Mark step as complete.
     */
    markComplete() {
        this.isComplete = true;
    }

    /**
     * Mark step as incomplete.
     */
    markIncomplete() {
        this.isComplete = false;
    }
}