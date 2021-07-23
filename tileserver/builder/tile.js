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
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.canvas = createCanvas(TILE_SIZE, TILE_SIZE);
        this.context = this.canvas.getContext('2d');
        this.context.save();
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        this.context.restore();
    }
    layerToCanvas(p) {
        const x = p.x - this.x * TILE_SIZE;
        const y = p.y - this.y * TILE_SIZE;
        return { x: x, y: y };
    }
    draw(feat) {
        const path = feat.layerData.map(this.layerToCanvas.bind(this));
        this.applyStyles(feat.styles);
        this.context.beginPath();
        for (const i in path) {
            this.context[(i === '0') ? 'moveTo' : 'lineTo'](path[i].x, path[i].y);
        }
        this.context.stroke();
    }
    applyStyles(styles) {
        this.context.restore();
        for (const [key, val] of Object.entries(styles)) {
            this.context[key] = val;
        }
    }
    writeImage(file) {
        if (!fs.existsSync(path.dirname(file)))
            fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, this.canvas.toBuffer('image/png'));
        console.log('wrote: ' + file);
    }
}
exports.Tile = Tile;
