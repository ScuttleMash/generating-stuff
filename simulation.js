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
        this.rulesAppliedCounter = 0;
        this.active = false;
        this.changesPerFrame = properties.changesPerFrame;
        this.canvas = new Canvas(properties.canvasId, properties.dimensions, properties.cellSize);
        this.grid = new Grid(properties.dimensions);
        this.ruleAttempts = properties.ruleAttempts;
    }

    start(rules) {
        this.interface = new Interface(rules);
        this.startSimulation = performance.now();
        this.rules = rules;
        this.active = true;
        this.simulate();
    }

    restart() {
        this.startSimulation = performance.now();
        this.rulesAppliedCounter = 0;
        this.canvas.reset();
        this.grid.reset();
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
            // updateRunningStateDisplay(this.active);
            // console.log(`Average updates per second: ${Math.floor(this.rulesAppliedCounter * 1000 / (performance.now() - this.startSimulation))}`);
            window.requestAnimationFrame(() => this.simulate());
        } else {
            console.log("No rule left to process. Stopping simulation.");
        }
    }

    applyOneRule() {
        while (!this.rules.isTapped()) {
            const activeRule = this.rules.getActiveRule();
            // this.interface.activate(this.rules.getActiveIndex());
            // for (let attempts = 0; attempts < this.ruleAttempts; attempts++) {
                const target = activeRule?.target(this.grid, this.ruleAttempts);
                if (target?.isValid()) {
                    const impacted = activeRule.apply(this.grid, target);
                    this.canvas.draw(impacted);
                    this.rulesAppliedCounter++;
                    return;
                }
            // }

            activeRule.tap();
            this.rules.goToNext();
        }

        this.active = false;
    }
}