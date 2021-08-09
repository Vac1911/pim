import { Canvas, NodeCanvasRenderingContext2D } from "canvas";
import type { DrawStyle, Point } from './interfaces'
import type { BBox } from "@turf/turf";
import { Feature } from './feature'
import {MapOptions} from "./interfaces";
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas')

export class Tile {
    x: number;
    y: number;
    z: number;
    options: MapOptions;
    canvas: Canvas;
    context: NodeCanvasRenderingContext2D;

    constructor(x: number, y: number, z: number, options: MapOptions) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.options = options;

        this.canvas = createCanvas(this.options.tileSize, this.options.tileSize)
        this.context = this.canvas.getContext('2d');
        this.context.save();
        this.context.fillStyle = options.bgColor;
        this.context.fillRect(0, 0, this.options.tileSize, this.options.tileSize);
        this.context.restore();
    }

    get boundingBox(): BBox {
        return [
            this.x * this.options.tileSize,
            this.y * this.options.tileSize,
            (this.x + 1) * this.options.tileSize,
            (this.y + 1) * this.options.tileSize,
        ]
    }

    layerToCanvas(p: Point): Point {
        const x: number = p.x - this.x * this.options.tileSize;
        const y: number = p.y - this.y * this.options.tileSize;
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
        fs.writeFileSync(file, this.canvas.toBuffer('raw'));
        // console.log('wrote: ' + file)
    }
}