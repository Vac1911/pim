import type { Point } from './interfaces'
import { Feature } from './feature'
import { Layer } from './layer'

const {execCmd} = require('../utils');
const chalk = require('chalk');
const log = console.log;

// CONSTANTS
const PI: number = Math.PI;
const PI_4: number = PI / 4;
const DEGREES_TO_RADIANS: number = PI / 180;
const RADIANS_TO_DEGREES: number = 180 / PI;
const LAYER_SIZE: number = 512;

module.exports = class Map {
    maxZoom: number;
    storagePath: string;
    options: object;
    layers: Layer[] = [];
    features: Feature[] = [];

    constructor(maxZoom: number, storagePath: string) {
        this.maxZoom = maxZoom;
        this.storagePath = storagePath;
    }

    async run() {
        await this.clearStorage();
        this.buildLayers();
        this.drawLayers();
    }

    async clearStorage() {
        await execCmd(`rm -rf ${this.storagePath}/*`);
    }

    buildLayers() {
        for (const z of Array(this.maxZoom).keys()) {
            this.layers[z] = new Layer(z, this.options);
        }
    }

    drawLayers() {
        for (const feat of this.features) {
            for (const z in this.layers) {
                this.layers[z].addFeature(feat);
            }
        }
        for (const z in this.layers) {
            log(chalk.green(`Drawing Layer ${z}`));
            this.layers[z].run();
            this.layers[z].writeTo(`${this.storagePath}`);
        }
    }

    addJsonFeature(feature, ...params) {
        const geometry = feature.type == 'Feature' ? feature.geometry : feature;

        let paths: any[] = [];
        if(geometry.type == 'MultiPolygon')
            paths = geometry.coordinates;
        else if(geometry.type == 'Polygon')
            paths = [geometry.coordinates];
        else if(geometry.type == 'LineString')
            paths = [[geometry.coordinates]];
        else if(geometry.type == 'MultiLineString')
            paths = geometry.coordinates.map(line => [line]);

        for(let path of paths) {
            path = path[0].map(([x, y]) =>    this.coordToWorld({x: x, y: y}));
            this.features.push(new Feature(path, ...params));
        }
    }

    /**
     * Project [lng,lat] on sphere onto [x,y] on 512*512 Mercator Zoom 0 layer.
     * Performs the nonlinear part of the web mercator projection.
     * Remaining projection is done with 4x4 matrices which also handles
     * perspective.
     * 
     * @see https://github.com/uber-web/math.gl/blob/master/modules/web-mercator/src/web-mercator-utils.js
     *
     * @param Point {x: lng, y: lat} Specifies a point on the sphere to project onto the map.
     * @return Point world pixel position.
     */
     coordToWorld({x: lng, y: lat}: Point) {
        //  Lattitude flipped because canvas system has flipped y axis
        // lat = -lat;

        const lambda2 = lng * DEGREES_TO_RADIANS;
        const phi2 = lat * DEGREES_TO_RADIANS;
        const x = (LAYER_SIZE * (lambda2 + PI)) / (2 * PI);
        const y = (LAYER_SIZE * (PI + Math.log(Math.tan(PI_4 + phi2 * 0.5)))) / (2 * PI);
        return {x: x, y: Math.abs(y - 512)};
    }

    // Unproject world point [x,y] on map onto {lat, lon} on sphere
    worldToLngLat({x, y}: Point) {
        const lambda2 = (x / LAYER_SIZE) * (2 * PI) - PI;
        const phi2 = 2 * (Math.atan(Math.exp((y / LAYER_SIZE) * (2 * PI) - PI)) - PI_4);
        return [lambda2 * RADIANS_TO_DEGREES, phi2 * RADIANS_TO_DEGREES];
    }
}