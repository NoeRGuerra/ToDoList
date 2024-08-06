class Step {
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

    /**
     * Create a Step instance from a plain object.
     * @param {Object} obj - The object to create a Step from.
     * @returns {Step} - The created Step instance.
     */
    static fromObject(obj){
        const step = new Step(obj.name);
        step.isComplete = obj.isComplete;
        return step;
    }
}

export default Step;