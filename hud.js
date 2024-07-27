document.addEventListener('keyup', (e) => {
    simulation.toggle();
});

function updateRunningStateDisplay(active) {
    document.getElementById("running").textContent = active;
}

class Interface {

    constructor(rules) {
        this.ruleIndex = 0;
        this.activeIndex = -1;
        this.steps = document.getElementById("steps");
        rules.getRulesAsArray().forEach(rule => {
            this.steps.innerHTML += `<li id="RULE_${this.ruleIndex}">${rule.name}</li>`;            
            this.ruleIndex++;
        });        
    }

    activate(index) {
        if (index != this.activeIndex) {
            if (this.activeIndex != -1) {
                document.getElementById(`RULE_${this.activeIndex}`).style.fontWeight = "normal";
            }
            this.activeIndex = index;
            if (index != -1) {
                document.getElementById(`RULE_${this.activeIndex}`).style.fontWeight = "bold";
            }
        }
    }
}