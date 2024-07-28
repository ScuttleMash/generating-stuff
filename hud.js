document.addEventListener('keypress', (e) => {
    switch (e.key) {
        case " ":
            simulation.toggle();
            return;
        case "r":
            simulation.restart();
    }
});

function updateRunningStateDisplay(active) {
    document.getElementById("running").textContent = active ? "Running...": "Finished!";
}

class Interface {
    constructor(rules) {
        this.ruleIndex = 0;
        this.activeIndex = -1;
        this.steps = document.getElementById("steps");
        rules.setDepth(0);
        rules.getRulesAsArray().forEach(rule => {
            this.steps.innerHTML += `<div class="step"><div id="RULE_${this.ruleIndex}" style="visibility: hidden">X</div>${new RuleVisualization(rule).getHtml()}</div>`;            
            this.ruleIndex++;
        });        
    }

    activate(index) {
        if (index != this.activeIndex) {
            if (this.activeIndex != -1) {
                document.getElementById(`RULE_${this.activeIndex + 1}`).style.visibility = "hidden";
            }
            this.activeIndex = index;
            if (index != -1) {
                document.getElementById(`RULE_${this.activeIndex + 1}`).style.visibility = "visible";
            }
        }
    }
}

class RuleVisualization {
    constructor(rule) {
        this.name = rule.name;
        this.depth = rule.depth;
        this.searchPattern = rule?.predicate?.pattern;
        this.resultPattern = rule?.action?.pattern;
    }

    getHtml() {
        return `<div class="step-depth-${this.depth}"></div>
                <div class="source-pattern">${this.visualize(this.searchPattern)}</div>
                <div> \=\=\> </div>
                <div class="target-pattern">${this.visualize(this.resultPattern)}</div>`;
    }

    visualize(pattern) {
        if (pattern == undefined) {
            return "";
        } else {
            const width = pattern.dimensions.width;
            const height = pattern.dimensions.height;
            return `<div style="display: grid;
                                grid-template-columns: repeat(${width}, 20px);
                                grid-template-rows: repeat(${height}), 20px);">
                                ${this.convert(pattern)}
                    </div>`;
        }
    }

    convert(pattern) {
        let html = "";
        for (let index = 0; index < pattern.sequence.length; index++) {
            html += `<div style="grid-column: ${(index % pattern.dimensions.width) + 1}; 
                                 grid-row: ${Math.floor(index / pattern.dimensions.width) + 1};
                                 color: ${pattern.sequence[index].colour.asRgb()};
                                 background: ${pattern.sequence[index].colour.asRgb()};">
                                 o
                    </div>`
        }
        return html;
    }
}