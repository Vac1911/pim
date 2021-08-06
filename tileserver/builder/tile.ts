import { Canvas, NodeCanvasRenderingContext2D } from "canvas";
import type { DrawStyle, Point } from './interfaces'
import type { BBox } from "@turf/turf";
import { Feature } from './feature'
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas')

// CONSTANTS
const PI: number = Math.PI;
const PI_4: number = PI / 4;
const DEGREES_TO_RADIANS: number = PI / 180;
const RADIANS_TO_DEGREES: number = 180 / PI;
const TILE_SIZE: number = 512;

export class Tile {
    x: number;
    y: number;
    z: number;
    options: object;
    canvas: Canvas;
    context: NodeCanvasRenderingContext2D;

    constructor(x: number, y: number, z: number, options: object = {}) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.options = options;

        this.canvas = createCanvas(TILE_SIZE, TILE_SIZE)
        this.context = this.canvas.getContext('2d');
        this.context.save();
        this.context.fillStyle = options['bgColor'] ?? '#000';
        this.context.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        this.context.restore();
    }

    get boundingBox(): BBox {
        return [
            this.x * TILE_SIZE,
            this.y * TILE_SIZE,
            (this.x + 1) * TILE_SIZE,
            (this.y + 1) * TILE_SIZE,
        ]
    }

    layerToCanvas(p: Point): Point {
        const x: number = p.x - this.x * TILE_SIZE;
        const y: number = p.y - this.y * TILE_SIZE;
        return { x: x, y: y };
    }

    draw(feat: Feature) {
        const start = process.uptime() * 1000;
        if(!feat.inBox(this.boundingBox)) return false;

        const path: Point[] = feat.layerData.map(this.layerToCanvas.bind(this));
        feat.draw(this.context, path);

        const diff = Math.floor(process.uptime() * 1000 - start);
        if(diff > 50)
        console.log(`${diff.toString().padStart(4, '0')}ms (${this.z}/${this.x}/${this.y}) ${feat.styles.name}`);
    }

    writeImage(file: string) {
        if (!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, this.canvas.toBuffer('image/png'));
        // console.log('wrote: ' + file)
    }
}