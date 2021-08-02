import type { BBox, DrawStyle, Point } from './interfaces'
import {NodeCanvasRenderingContext2D} from "canvas";

export class Feature {
    worldData: Point[];
    layerData!: Point[];
    layerBbox!: BBox;
    styles!: DrawStyle;

    constructor(worldData: Point[], styles?: DrawStyle) {
        this.worldData = worldData;
        if (styles !== undefined) this.styles = styles;
    }

    static fromGeoJson(geoJson: object) {
        
    }

    scaleTo(zoomLevel: number) {
        const scalar: number = 2 ** zoomLevel;
        this.layerData = [];

        let maxX: number|undefined = undefined,
            minX: number|undefined = undefined,
            maxY: number|undefined = undefined,
            minY: number|undefined = undefined;

        for(const p of this.worldData) {
            const point: Point = {x: p.x * scalar, y: p.y * scalar};
            if(maxX === undefined || point.x > maxX) maxX = point.x;
            if(minX === undefined || point.x < minX) minX = point.x;
            if(maxY === undefined || point.y > maxY) maxY = point.y;
            if(minY === undefined || point.y < minY) minY = point.y;
            this.layerData.push(point);
        }
        this.layerBbox = { maxX: maxX ?? 0, minX: minX ?? 0, maxY: maxY ?? 0, minY: minY ?? 0}
        return this;
    }

    inBox(box: BBox): boolean {
        // no horizontal overlap
        if (this.layerBbox.minX >= box.maxX || box.minX >= this.layerBbox.maxX) return false;
    
        // no vertical overlap
        if (this.layerBbox.minY >= box.maxY || box.minY >= this.layerBbox.maxY) return false;
    
        return true;
    }

    draw(context: NodeCanvasRenderingContext2D, pathData: Point[]) {
        this.setStyles(context);
        this.makePath(context, pathData);
        this.drawPath(context);
    }

    setStyles(context: NodeCanvasRenderingContext2D) {
        context.restore();
        for(const [key, val] of Object.entries(this.styles)) {
            context[key] = val;
        }
    }

    makePath(context: NodeCanvasRenderingContext2D, pathData: Point[]) {
        context.beginPath();
        for(const i in pathData) {
            context[(i === '0') ? 'moveTo' : 'lineTo'](pathData[i].x, pathData[i].y)
        }
    }

    drawPath(context: NodeCanvasRenderingContext2D) {
        if(this.styles.fillStyle) context.fill();
        if(this.styles.strokeStyle) context.stroke();
    }
}