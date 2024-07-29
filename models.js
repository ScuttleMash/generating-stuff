// ============================
// =========== DATA ===========
// ============================
class Colour {
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = 255;
    }

    matches(colour) {
        return this.red == colour.red && this.green == colour.green && this.blue == colour.blue;
    }

    asRgb() {
        return `RGB(${this.red}, ${this.green}, ${this.blue})`;
    }
}

class ActionResult {
    constructor(colour) {
        this.colour = colour;
    }
}

class GridLocation {
    constructor(column, row) {
        this.column = column;
        this.row = row;
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

// ================================
// =========== PATTERNS ===========
// ================================

class Pattern {
    constructor(sequence, dimensions) {
        if (sequence.length != dimensions.height * dimensions.width) {
            console.error("Invalid pattern! ", sequence, dimensions);
        }

        this.sequence = sequence;
        this.dimensions = dimensions;
    }
}

class LinePattern extends Pattern {
    constructor(sequence) {
        super(sequence, new Dimensions(sequence.length, 1));
    }
}

class SingleCellPattern extends Pattern {
    constructor(patternItem) {
        super([patternItem], new Dimensions(1, 1));
    }
}

class ColourBlockPattern extends Pattern {
    constructor(colour, dimensions) {
        let sequence = [];
        for (let index = 0; index < dimensions.width * dimensions.height; index++) {
            sequence.push(colour);
        }
        super(sequence, dimensions);
    }
}

class PatternItem {
    constructor(colour) {
        this.colour = colour;
        this.wildcard = false;
    }
}

class WildcardItem extends PatternItem {
    constructor() {
        super(new Colour(-1, -1, -1));
        this.wildcard = true;
    }
}


// =============================
// =========== RULES ===========
// =============================

class Rule {
    constructor(predicate, action) {
        this.timesUsed = 0;
        this.predicate = predicate;
        this.action = action;
        this.name = name;
        this.depth = 0;
        this.tapped = false;
    }

    target(grid, attempts) {
        return this.predicate.test(grid, attempts);
    }

    apply(grid, target) {        
        this.timesUsed++;
        return grid.process(target, this.action);
    }

    getActiveRule() {
        return this;
    }

    getRulesAsArray() {
        return [this];
    }

    isGroup() {
        return false;
    }

    getRuleCount() {
        return 1;
    }

    setDepth(depth) {
        this.depth = depth;
    }

    getDepth() {
        return this.depth;
    }

    isTapped() {
        return this.tapped;
    }

    tap() {
        this.tapped = true;
    }

    untap() {
        this.tapped = false;
    }

    startOver() {
        this.tapped = false;
    }
}

class LimitedRule extends Rule {
    constructor(limit, predicate, action) {
        super(predicate, action);
        this.limit = limit;
    }

    isTapped() {
        return this.timesUsed >= this.limit;
    }

    untap() {
        this.timesUsed = 0;
    }
}

// ==================================
// =========== PREDICATES ===========
// ==================================

class Predicate {
    constructor(pattern) {
        this.pattern = pattern;
    }

    test(grid, attempts) {
        for (let attempt = 0; attempt < attempts; attempt++) {
            const cells = grid.search(this.pattern);
            if (cells.length == this.pattern.sequence.length) {
                if (this.patternMatches(cells)) {
                    return new ValidTarget(cells);
                }
            }
        }
        return new InvalidTarget();
    }

    patternMatches(cells) {
        for (let index = 0; index < cells.length; index++) {
            if (cells[index] == undefined) {
                return false;
            }
            if (!this.pattern.sequence[index].wildcard && !cells[index].matches(this.pattern.sequence[index])) {
                return false;
            }
        }
        return true;
    }
}

class FixedLocationPredicate extends Predicate {
    constructor(location, pattern) {
        super(pattern);
        this.location = location;
    }

    test(grid) {
        const cells = [grid.getCell(this.location.column, this.location.row)];
        return new ValidTarget(cells);
    }
}

// ===============================
// =========== ACTIONS ===========
// ===============================

class Action {
    constructor(pattern) {
        this.pattern = pattern;
        this.currentTile = -1;
    }

    apply(cell) {
        this.currentTile = (this.currentTile + 1) % this.pattern.sequence.length;
        let patternItem = this.pattern.sequence[this.currentTile];
        if (patternItem.wildcard) {
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
        this.depth = 0;
    }

    isGroup() {
        return true;
    }

    getRuleCount() {
        return this.ruleCount;
    }

    getRulesAsArray() {
        let result = [this];
        this.rules.forEach(rule => {
            result.push(...rule.getRulesAsArray());
        });
        return result;
    }

    setDepth(depth) {
        this.depth = depth;
        this.rules.forEach(rule => {
            rule.setDepth(depth + 1);
        });
    }

    getDepth() {
        return this.depth;
    }

    isTapped() {
        return this.rules.map(rule => rule.isTapped()).reduce((a, b) => a && b, true);
    }

    getActiveRule() {
        let activeRule = this.rules[this.index];
        while (activeRule.isTapped()) {
            this.goToNext();
            activeRule = this.rules[this.index];
        }

        if (activeRule.isGroup()) {
            activeRule = activeRule.getActiveRule();
        }
        return activeRule;
    }

    untap() {
        this.rules.forEach(rule => rule.untap());
    }
}

class RoundRobinRuleGroup extends RuleGroup {
    constructor(rules, name = "UNNAMED ROUND ROBIN RULEGROUP") {
        super(rules, name);
        this.index = random(rules.length);
    }

    goToNext() {
        if (this.rules[this.index].isTapped()) {
            this.index = (this.index + 1) % this.rules.length
        }
    }

    startOver() {
        this.index = random(this.rules.length);
        this.rules.forEach(rule => rule.startOver());
    }
}

class SequentialRuleGroup extends RuleGroup {
    constructor(rules, name = "UNNAMED SEQUENTIAL RULEGROUP") {
        super(rules, name);
        this.index = 0;
    }

    goToNext() {
        if (this.rules[this.index].isTapped()) {
            this.index++;
        }
    }

    startOver() {
        this.index = 0;
        this.rules.forEach(rule => rule.startOver());
    }
}