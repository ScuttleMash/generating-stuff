const cellSize = 10;
const canvasId = "canvas";

const properties = {
    changesPerFrame: 5,
    cellSize: cellSize,
    dimensions: {
        columns: Math.floor(document.getElementById(canvasId).getBoundingClientRect().width / cellSize),
        rows: Math.floor(document.getElementById(canvasId).getBoundingClientRect().height / cellSize),
    },
    ruleAttempts: 100000,
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
        this.rules = new Rules(rules);
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
                this.applyOneRule();
            }
            this.canvas.flush();
            updateRunningStateDisplay(this.active);
            // console.log(`Average updates per second: ${Math.floor(this.rulesAppliedCounter * 1000 / (performance.now() - this.startSimulation))}`);
            window.requestAnimationFrame(() => this.simulate());
        } else {
            console.log("No rule left to process. Stopping simulation.");
        }
    }

    applyOneRule() {
        while (this.rules.hasActiveRule()) {
            let ruleApplied = false;
            const activeRule = this.rules.getActiveRule();
            this.interface.activate(this.rules.getActiveIndex());
            for (let attempts = 0; attempts < this.ruleAttempts && !ruleApplied; attempts++) {
                const target = activeRule?.target(this.grid);
                if (target?.isValid()) {
                    const impacted = activeRule.apply(this.grid, target);
                    ruleApplied = true;
                    this.canvas.draw(impacted);
                    this.rules.startFromBeginning();
                }
            }

            if (ruleApplied) {
                this.rulesAppliedCounter++;
                return;
            } else {
                this.rules.next();
            }
        }
        this.active = false;
    }
}

class Rules {
    constructor(rules) {
        this.rules = rules;
        this.activeRuleIndex = 0;
        this.activeRule = this.rules.getNextRule(this.activeRuleIndex);
    }

    getActiveRule() {
        while (this.activeRule != undefined && (this.activeRule.isTapped() || this.activeRule.isGroup())) {
            this.activeRuleIndex++;
            this.activeRule = this.rules.getNextRule(this.activeRuleIndex);    
        }

        return this.activeRule;
    }

    getActiveIndex() {
        return this.activeRuleIndex;
    }

    hasActiveRule() {
        return this.activeRule != undefined;
    }

    next() {
        this.activeRuleIndex++;
        this.activeRule = this.rules.getNextRule(this.activeRuleIndex);    
    }
    
    startFromBeginning() {
        this.activeRuleIndex = 0;
        this.activeRule = this.rules.getNextRule(this.activeRuleIndex);
    }
}