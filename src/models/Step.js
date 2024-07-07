export class Step {
    constructor(name) {
        this.name = name;
        this.isComplete = false;
    }

    markComplete() {
        this.isComplete = true;
    }

    markIncomplete() {
        this.isComplete = false;
    }
}