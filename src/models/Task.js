const Step = require('./Step');

export class Task {
    constructor(name, dueDate=null, isImportant=false) {
        this.name = name;
        this.description = '';
        this.dueDate = dueDate;
        this.isImportant = isImportant;
        this.steps = [];
        this.isComplete = false;
    }

    addStep(step) {
        if (!(step instanceof Step)){
            throw new Error('Invalid step: Must be an instance of Step');
        }
        this.steps.push(step);
    }

    removeStep(stepName) {
        this.steps = this.steps.filter(step => step.name !== stepName);
    }

    checkCompletion() {
        this.isComplete = this.steps.every(step => step.isComplete);
    }

    markComplete() {
        this.isComplete = true;
    }

    markIncomplete() {
        this.isComplete = false;
    }

    setDueDate(dueDate) {
        this.dueDate = dueDate;
    }

    setDescription(description) {
        this.description = description;
    }
}