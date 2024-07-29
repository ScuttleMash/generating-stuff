const cellSize = 20;
const canvasId = "canvas";

const properties = {
    changesPerFrame: 1,
    cellSize: cellSize,
    dimensions: {
        columns: Math.floor(document.getElementById(canvasId).getBoundingClientRect().width / cellSize),
        rows: Math.floor(document.getElementById(canvasId).getBoundingClientRect().height / cellSize),
    },
    ruleAttempts: 10000,
    canvasId: canvasId
}

class Simulation {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.rulesAppliedCounter = 0;
        this.active = false;
        this.changesPerFrame = properties.changesPerFrame;
        this.canvas = new Canvas(properties.canvasId, properties.dimensions, properties.cellSize);
        this.grid = new Grid(properties.dimensions);
        this.ruleAttempts = properties.ruleAttempts;
    }

    start(rules) {
        this.interface = new Interface(rules);
        this.rules = rules;
        this.active = true;
        this.simulate();
    }

    restart() {
        this.initialize();
        this.rules.untap();
        this.active = true;
        this.simulate();
    }

    toggle() {
        this.active = !this.active;
        if (this.active) {
            this.simulate();
        }
    }

    simulate() {
        if (this.active) { 
            for (let index = 0; index < this.changesPerFrame; index++) {
                this.rules.startOver();
                this.applyOneRule();
            }
            this.canvas.flush();
            updateRunningStateDisplay(this.active);
            window.requestAnimationFrame(() => this.simulate());
        }
    }

    applyOneRule() {
        while (!this.rules.isTapped()) {
            const activeRule = this.rules.getActiveRule();
            // this.interface.activate(this.rules.getActiveIndex());
            const target = activeRule?.target(this.grid, this.ruleAttempts);
            if (target?.isValid()) {
                const impacted = activeRule.apply(this.grid, target);
                this.canvas.draw(impacted);
                this.rulesAppliedCounter++;
                return;
            }

            activeRule.tap();
            this.rules.goToNext();
        }

        this.active = false;
    }
}