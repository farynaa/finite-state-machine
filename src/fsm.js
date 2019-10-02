const config = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry',
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            },
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal',
            },
        },
    }
};

class FSM {

    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error('Config isnt pass');
        } else {
            this.config = config;
            this.history = [];
            this.pointer = 0;
            this.counter = 0;
            this.redoHistory = [];
            this.changeState(config.initial);

        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.config.states[state]) {
            throw new Error("Wrong state");
        } else {
            this.state = state;
            this.history.push(state);
            this.redoHistory = [];
            //console.log(' state changed to: ', this.state, ' history: ', this.history, 'redo: ', this.redoHistory);

        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {

        const currentState = this.state;
        const newState = this.config.states[this.state].transitions[event];
        if (!newState) {
            throw new Error("Wrong event");
        } else {
            //console.log('TRIGGER: ', event);
            this.changeState(newState);
        }
    }


    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.history = [];
        this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (event) {
            return Object.keys(this.config.states).filter(e => this.config.states[e].transitions[event]);
        } else {
            return Object.keys(this.config.states);
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.length <= 1) {
            return false;
        } else {
            const lastInHistory = this.history.pop();
            this.redoHistory.push(lastInHistory);
            this.state = this.history.slice(-1)[0];
            //console.log('UNDO state changed to: ', this.state, ' history: ', this.history, 'redo: ', this.redoHistory);
            return true;
        }
        //console.log('UNDO state changed to: ', this.state, ' history: ', this.history,' redo: ', this.redo);

    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        //console.log(this.redoHistory);
        if (this.redoHistory.length < 1) {
            return false;
        } else {
            this.history = [];
            this.history.push(this.redoHistory.pop())
            this.state = this.history.slice(-1)[0];
            //console.log('REDO state changed to: ', this.state, ' history: ', this.history, 'redo: ', this.redoHistory);
            //console.log('REDO: state changed to: ', this.state, ' history: ', this.history,' redo: ', this.redo);
            return true;
        }

    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.redoHistory = [];
        this.history = [];
    }
}

/*
const student = new FSM(config);

student.trigger('study');
student.undo();
student.redo();
console.log(student.getState())
student.trigger('get_tired');
student.trigger('get_hungry');

student.undo();
student.undo();

student.redo();
student.redo();

console.log(student.getState())
*/


module.exports = FSM;

/** @Created by Uladzimir Halushka **/
