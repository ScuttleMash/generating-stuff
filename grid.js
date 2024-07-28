class Grid {

    static UP = 0;
    static RIGHT = 1;
    static DOWN = 2;
    static LEFT = 3;

    constructor(configuration) { 
        this.width = configuration.columns;
        this.height = configuration.rows;
        this.cells = [];
        this.initialize();
    }

    initialize() {
        for (let index = 0; index < this.width * this.height; index++) {
            this.cells[index] = new GridCell(1, Math.floor(index / this.width), index % this.width, new Colour(0, 0, 0));
        }
    }

    reset() {
        for (let index = 0; index < this.width * this.height; index++) {
            this.cells[index] = new GridCell(1, Math.floor(index / this.width), index % this.width, new Colour(0, 0, 0));
        }
    }

    process(target, action) {
        let impacted = [];
        target.cells.forEach(cell => {
            let index = cell.row * this.width + cell.column;
            this.cells[index].apply(action.apply(cell));                
            impacted = [...impacted, this.cells[index]];
        });
        return impacted;
    }

    search(pattern) {
        const initialCell = this.getRandomCell();
        const column = initialCell.column;
        const row = initialCell.row;
        const directions = [true, true, true, true];
        if (initialCell.matches(pattern.sequence[0])) {
            if (pattern.sequence.length == 1) {
                return [initialCell];
            } else {
                let upCells = [initialCell];
                let rightCells = [initialCell];
                let downCells = [initialCell];
                let leftCells = [initialCell];
                // Has bias towards UP => RIGHT => DOWN => LEFT. Needs proper random pick for all matching directions.
                for (let remainingCellIndex = 1; remainingCellIndex < pattern.sequence.length; remainingCellIndex++) {
                    const widthShift = remainingCellIndex % pattern.dimensions.width;
                    const heightShift = Math.floor(remainingCellIndex / pattern.dimensions.width);
                    if (directions[Grid.UP]) {
                        // row - 1
                        // als dimension width behaald is, column + 1
                        const cell = this.getCell(column + heightShift, row - widthShift);
                        directions[Grid.UP] = cell?.matches(pattern.sequence[remainingCellIndex]) == true;
                        if (directions[Grid.UP]) {
                            upCells.push(cell);
                        }
                    }
                    if (directions[Grid.RIGHT]) {
                        // column + 1
                        // als dimension width behaald is, row + 1
                        const cell = this.getCell(column + widthShift, row + heightShift);
                        directions[Grid.RIGHT] = cell?.matches(pattern.sequence[remainingCellIndex]) == true;
                        if (directions[Grid.RIGHT]) {
                            rightCells.push(cell);
                        }
                    }
                    if (directions[Grid.DOWN]) {
                        // row + 1
                        // als dimension width behaald is, column - 1
                        const cell = this.getCell(column - heightShift, row + widthShift);
                        directions[Grid.DOWN] = cell?.matches(pattern.sequence[remainingCellIndex]) == true;
                        if (directions[Grid.DOWN]) {
                            downCells.push(cell);
                        }
                    }
                    if (directions[Grid.LEFT]) {
                        // column - 1
                        // als dimension width behaald is, row - 1
                        const cell = this.getCell(column - widthShift, row - heightShift);
                        directions[Grid.LEFT] = cell?.matches(pattern.sequence[remainingCellIndex]) == true;
                        if (directions[Grid.LEFT]) {
                            leftCells.push(cell);
                        }
                    }
                }
                const validDirections = directions.flatMap((bool, index) => bool ? index : []);
                const chosenDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
                switch (chosenDirection) {
                    case Grid.UP:
                        return upCells;
                    case Grid.RIGHT:
                        return rightCells;
                    case Grid.DOWN:
                        return downCells;
                    case Grid.LEFT:
                        return leftCells;
                    default:
                        return [];
                    }
            }
        } else {
            return [];
        }
    }

    getRandomCell() {
        return this.getCell(this.random(this.width), this.random(this.height));
    }

    getCell(column, row) {
        if (column < 0 || column >= this.width || row < 0 || row >= this.height) {
            return undefined;
        }
        return this.cells[row * this.width + column];
    }

    random(max) {
        return Math.floor(Math.random() * max);
    }
}

class GridCell {
    constructor(identifier, row, column, colour) { 
        this.identifier = identifier;
        this.row = row;
        this.column = column;
        this.colour = colour;
    } 

    apply(actionResult) {
        this.colour = actionResult.colour;
    }

    matches(item) {
        return this.colour.matches(item.colour);
    }
}
