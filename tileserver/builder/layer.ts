import type { Point } from './interfaces'
import { Feature } from './feature'
import { Tile } from './tile'

// CONSTANTS
const PI: number = Math.PI;
const PI_4: number = PI / 4;
const DEGREES_TO_RADIANS: number = PI / 180;
const RADIANS_TO_DEGREES: number = 180 / PI;
const TILE_SIZE: number = 512;

export class Layer {
    zoom: number;
    options: object;
    storagePath!: string;
    tiles: Tile[][] = [];
    features: Feature[] = [];

    constructor(zoom: number, options: object = {}) {
        this.zoom = zoom;
        this.options = options;
    }

    run() {
        this.buildTiles();
        this.drawTiles();
    }

    buildTiles() {
        const length: number = 2 ** this.zoom;
        for (const x of Array(length).keys()) {
            let tileColumn: Tile[] = [];
            for (const y of Array(length).keys()) {
                tileColumn[y] = new Tile(x, y, this.zoom, this.options);
            }
            this.tiles[x] = tileColumn;
        }
    }

    drawTiles() {
        for (const feat of this.features) {
            feat.scaleTo(this.zoom);
            for (const x in this.tiles) {
                for (const y in this.tiles[x]) {
                    this.tiles[x][y].draw(feat);
                }
            }
        }
    }

    writeTo(storagePath: string) {
        this.storagePath = storagePath;
        this.writeTiles();
    }

    writeTiles() {
        for (const x in this.tiles) {
            for (const y in this.tiles[x]) {
                this.tiles[x][y].writeImage(`${this.storagePath}/${this.zoom}/${x}/${y}.png`);
            }
        }
    }

    addFeature(feat: Feature) {
        this.features.push(feat);
        return this;
    }
}