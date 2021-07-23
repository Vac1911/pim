import {Canvas, NodeCanvasRenderingContext2D} from "canvas";
import type { DrawStyle, Point } from './interfaces'
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
    canvas: Canvas;
    context: NodeCanvasRenderingContext2D;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.canvas = createCanvas(TILE_SIZE, TILE_SIZE)
        this.context = this.canvas.getContext('2d');
        this.context.save();
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        this.context.restore();
    }

     layerToCanvas(p: Point) {
        const x: number = p.x - this.x * TILE_SIZE;
        const y: number = p.y - this.y * TILE_SIZE;
        return {x: x, y: y};
    }

    draw(feat: Feature) {
        const path: Point[] = feat.layerData.map(this.layerToCanvas.bind(this));
        this.applyStyles(feat.styles);

        this.context.beginPath();

        for(const i in path) {
            this.context[(i === '0') ? 'moveTo' : 'lineTo'](path[i].x, path[i].y)
        }

        this.context.stroke();
    }

    applyStyles(styles: DrawStyle) {
        this.context.restore();
        for(const [key, val] of Object.entries(styles)) {
            this.context[key] = val;
        }
    }

    writeImage(file: string) {
        if (!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, this.canvas.toBuffer('image/png'));
        console.log('wrote: ' + file)
    }

    // createMarker(coord: Point, color: string) {
    //     const world = this.coordToWorld(coord);
    //     console.log(coord, world);
    //     this.context.fillStyle = color;
    //     this.context.beginPath();
    //     this.context.ellipse(world.x, world.y, 4, 4, 0, 0, 2 * Math.PI)
    //     this.context.fill();
    //     this.context.restore();
    // }

    // createPolygon(coordList: Point[], color: string) {
    //     this.context.fillStyle = color;
    //     this.context.strokeStyle = color;
    //     this.context.beginPath();
    //     for(const i in coordList) {
    //         const pixel = this.coordToWorld(coordList[i]);
    //         const method = (i === '0') ? 'moveTo' : 'lineTo';
    //         this.context[method](pixel.x, pixel.y)
    //     }
    //     this.context.closePath();
    //     this.context.stroke();
    //     this.context.restore();
    // }

    // createFeature(feature, color: string) {
    //     let polygons: any[] = [];
    //     if(feature.geometry.type == 'MultiPolygon')
    //         polygons = feature.geometry.coordinates;
    //     else if(feature.geometry.type == 'Polygon')
    //         polygons = [feature.geometry.coordinates];

    //     for(let polygon of polygons) {
    //         polygon = polygon[0].map(([x, y]) =>({x: x, y: y}));
    //         this.createPolygon(polygon, color);
    //     }
    // }
}