"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
// CONSTANTS
const PI = Math.PI;
const PI_4 = PI / 4;
const DEGREES_TO_RADIANS = PI / 180;
const RADIANS_TO_DEGREES = 180 / PI;
const TILE_SIZE = 512;
class Tile {
    constructor(x, y, z, options = {}) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.options = options;
        this.canvas = createCanvas(TILE_SIZE, TILE_SIZE);
        this.context = this.canvas.getContext('2d');
        this.context.save();
        this.context.fillStyle = options['bgColor'] ?? '#000';
        this.context.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        this.context.restore();
    }
    get boundingBox() {
        return [
            this.x * TILE_SIZE,
            this.y * TILE_SIZE,
            (this.x + 1) * TILE_SIZE,
            (this.y + 1) * TILE_SIZE,
        ];
    }
    layerToCanvas(p) {
        const x = p.x - this.x * TILE_SIZE;
        const y = p.y - this.y * TILE_SIZE;
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
