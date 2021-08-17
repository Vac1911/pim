import type {DrawStyle, Point} from './interfaces'
import type {BBox} from "@turf/turf";
import {NodeCanvasRenderingContext2D} from "canvas";
import {LineString, Polygon} from "@turf/turf";

const {lineString, polygon} = require('@turf/helpers');
const bboxClip = require('@turf/bbox-clip');

export class Feature {
    geometry;
    worldData!: Point[];
    layerData!: Point[];
    layerBbox!: BBox;
    styles!: DrawStyle;

    constructor(geometry, styles?: DrawStyle) {
        this.geometry = geometry;
        if (styles !== undefined) this.styles = styles;
    }

    static fromGeoJson(geoJson, styles?: DrawStyle) {
        const geometry = geoJson.type == 'Feature' ? geoJson.geometry : geoJson;
        return new Feature(geometry, styles);

        let paths: any[] = [];
        if(geometry.type == 'MultiPolygon')
            paths = geometry.coordinates;
        else if(geometry.type == 'Polygon')
            paths = [geometry.coordinates];
        else if(geometry.type == 'LineString')
            paths = [[geometry.coordinates]];
        else if(geometry.type == 'MultiLineString')
            paths = geometry.coordinates.map(line => [line]);
        return paths;
    }

    getGeom() {
        const path = this.layerData.map(p => [p.x, p.y]);
        if(this.styles.fillStyle) return polygon([path]);
        else return lineString(path);
    }

    // getPath(geom: Polygon|LineString) {
    //     if(geom.type === "Polygon") return getCoords([path]);
    //     else return lineString(path);
    // }

    scaleTo(zoomLevel: number) {
        const scalar: number = 2 ** zoomLevel;
        this.layerData = [];

        let maxX: number | undefined = undefined,
            minX: number | undefined = undefined,
            maxY: number | undefined = undefined,
            minY: number | undefined = undefined;

        for (const p of this.worldData) {
            const point: Point = {x: p.x * scalar, y: p.y * scalar};
            if (maxX === undefined || point.x > maxX) maxX = point.x;
            if (minX === undefined || point.x < minX) minX = point.x;
            if (maxY === undefined || point.y > maxY) maxY = point.y;
            if (minY === undefined || point.y < minY) minY = point.y;
            this.layerData.push(point);
        }
        this.layerBbox = [minX ?? 0, minY ?? 0,  maxX ?? 0, maxY ?? 0];
        return this;
    }

    clip(box: BBox) {
        return bboxClip(this.getGeom(), box);
    }

    inBox(box: BBox): boolean {
        // no horizontal overlap
        if (this.layerBbox[0] >= box[2] || box[0] >= this.layerBbox[2]) return false;

        // no vertical overlap
        return !(this.layerBbox[1] >= box[3] || box[1] >= this.layerBbox[3]);
    }

    draw(context: NodeCanvasRenderingContext2D, pathData: Point[]) {
        this.setStyles(context);
        this.makePath(context, pathData);
        this.drawPath(context);
    }

    setStyles(context: NodeCanvasRenderingContext2D) {
        context.restore();
        for (const [key, val] of Object.entries(this.styles)) {
            context[key] = val;
        }
    }

    makePath(context: NodeCanvasRenderingContext2D, pathData: Point[]) {
        context.beginPath();
        for (const i in pathData) {
            context[(i === '0') ? 'moveTo' : 'lineTo'](pathData[i].x, pathData[i].y)
        }
    }

    drawPath(context: NodeCanvasRenderingContext2D) {
        if (this.styles.fillStyle) context.fill();
        if (this.styles.strokeStyle) context.stroke();
    }
}