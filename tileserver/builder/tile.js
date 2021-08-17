"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
class Tile {
    constructor(x, y, z, options) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.options = options;
        this.canvas = createCanvas(this.options.tileSize, this.options.tileSize);
        this.context = this.canvas.getContext('2d');
        this.context.antialias = 'none';
        this.context.save();
        this.context.fillStyle = options.bgColor;
        this.context.fillRect(0, 0, this.options.tileSize, this.options.tileSize);
        this.context.restore();
    }
    get boundingBox() {
        return [
            this.x * this.options.tileSize,
            this.y * this.options.tileSize,
            (this.x + 1) * this.options.tileSize,
            (this.y + 1) * this.options.tileSize,
        ];
    }
    layerToCanvas(p) {
        const x = p.x - this.x * this.options.tileSize;
        const y = p.y - this.y * this.options.tileSize;
        return { x: x, y: y };
    }
    draw(feat) {
        const start = process.uptime() * 1000;
        if (!feat.inBox(this.boundingBox))
            return false;
        const path = feat.layerData.map(this.layerToCanvas.bind(this));
        feat.draw(this.context, path);
        const diff = Math.floor(process.uptime() * 1000 - start);
        if (diff > 50)
            console.log(`${diff.toString().padStart(4, '0')}ms (${this.z}/${this.x}/${this.y}) ${feat.styles.name}`);
    }
    writeImage(file) {
        if (!fs.existsSync(path.dirname(file)))
            fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, this.canvas.toBuffer('image/png'));
        // console.log('wrote: ' + file)
    }
}
exports.Tile = Tile;
