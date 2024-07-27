// ============================
// =========== DATA ===========
// ============================
class Colour {
    constructor(red, green, blue, alpha = 255) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    matches(colour) {
        return this.red == colour.red && this.green == colour.green && this.blue == colour.blue;
    }
}

class ActionResult {
    constructor(colour) {
        this.colour = colour;
    }
}

class Pattern {
    constructor(sequence, dimensions) {
        if (sequence.length != dimensions.height * dimensions.width) {
            console.error("Invalid pattern! ", sequence, dimensions);
        }

        this.sequence = sequence;
        this.dimensions = dimensions;
    }
}

class PatternItem {
    constructor(colour, wildcard = 0) {
        this.colour = colour;
        this.wildcard = wildcard;
    }

    isWildcard() {
        return this.wildcard == 1;
    }
}

class Dimensions {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

class ValidTarget {
    constructor(cells) {
        this.cells = cells;
    }
    
    isValid() {
        return true;
    }
}

class InvalidTarget {
    constructor() { }
    
    isValid() {
        return false;
    }
}

// =============================
// =========== RULES ===========
// =============================

class PatternRule {
    constructor(identifier, timesAllowed, predicate, action, name = "UNNAMED RULE") {
        this.identifier = identifier;
        this.timesAllowed = timesAllowed;
        this.timesUsed = 0;
        this.predicate = predicate;
        this.action = action;
        this.name = name;
    }

    apply(grid, target) {        
        this.timesUsed++;
        return grid.process(target, this.action);
    }

    target(grid) {
        const cells = grid.search(this.predicate.pattern);
        if (this.predicate.test(cells)) {
            return new ValidTarget(cells);
        } else {
            return new InvalidTarget();
        }
    }

    getRulesAsArray() {
        return [this];
    }

    isTapped() {
        return this.timesAllowed != -1 && this.timesUsed >= this.timesAllowed;
    }

    getNextRule() {
        return this;
    }

    isGroup() {
        return false;
    }

    getRuleCount() {
        return 1;
    }
}

// ==================================
// =========== PREDICATES ===========
// ==================================

class Predicate {
    constructor(pattern) {
        this.pattern = pattern;
    }

    test(cells) {
        if (cells.length != this.pattern.sequence.length) {
            return false;
        }

        for (let index = 0; index < cells.length; index++) {
            if (cells[index] == undefined) {
                return false;
            }

            if (!this.pattern.sequence[index].isWildcard() && !cells[index].matches(this.pattern.sequence[index])) {
                return false;
            }
        }
        return true;
    }
}

// ===============================
// =========== ACTIONS ===========
// ===============================

class Action {
    apply(cell) {
        throw new Error("Implement me!");
    }
}

class ColourAction extends Action {
    constructor(colour) {
        super();
        this.colour = colour;
    }

    apply(cell) {
        return new ActionResult(this.colour);
    }
}

class PatternAction extends Action {
    constructor(pattern) {
        super();
        this.pattern = pattern;
        this.currentTile = -1;
    }

    apply(cell) {
        this.currentTile = (this.currentTile + 1) % this.pattern.sequence.length;
        let patternItem = this.pattern.sequence[this.currentTile];
        if (patternItem.isWildcard()) {
            return new ActionResult(cell.colour);
        }
        return new ActionResult(patternItem.colour);
    }
}

// ===================================
// =========== RULE_GROUPS ===========
// ===================================

class RuleGroup {
    constructor(rules, name) {
        this.rules = rules;    
        this.ruleCount = this.rules.map(rule => rule.getRuleCount()).reduce((x, y) => x + y, 1);
        this.name = name;
    }

    isGroup() {
        return true;
    }

    getRuleCount() {
        return this.ruleCount;
    }

    getActiveRule() {
        throw new Error("Implement me!");
    }

    getRulesAsArray() {
        let result = [this];
        this.rules.forEach(rule => {
            result.push(...rule.getRulesAsArray());
        });
        return result;
    }
}

class RoundRobinRuleGroup extends RuleGroup {
    constructor(rules, name = "UNNAMED ROUND ROBIN RULEGROUP") {
        super(rules, name);
        this.lastIndexUsed = 0;
    }

    getNextRule(index) {
        if (index > this.rules.length) {
            return undefined;
        }
        this.lastIndexUsed = (this.lastIndexUsed + 1) % this.rules.length
        return this.rules[this.lastIndexUsed];
    }
}

class SequentialRuleGroup extends RuleGroup {
    constructor(rules, name = "UNNAMED SEQUENTIAL RULEGROUP") {
        super(rules, name);
    }

    getNextRule(index) {
        return this.rules[index];
    }
}