class Canvas {

    constructor(canvasId, dimensions, cellSize) {
        this.cellSize = cellSize;
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = dimensions.columns * cellSize;
        this.canvas.height = dimensions.rows * cellSize;
        this.ctx = this.canvas.getContext("2d");
        this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(cells) {
        cells.forEach(cell => {
            this.colourCell(cell.column, cell.row, cell.colour);
        });
    }

    flush() {
        this.ctx.putImageData(this.imageData, 0, 0);      
    }

    colourCell(column, row, colour) {        
        for (let cellY = 0; cellY < this.cellSize; cellY++) {
            for (let cellX = 0; cellX < this.cellSize; cellX++) {
                let index = ((column * this.cellSize + cellX) + (row * this.cellSize + cellY) * this.canvas.width) * 4;                
                this.imageData.data[index + 0] = colour.red;
                this.imageData.data[index + 1] = colour.green;
                this.imageData.data[index + 2] = colour.blue;
                this.imageData.data[index + 3] = colour.alpha;
            }
        }
    }
}