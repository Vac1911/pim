import type { DrawStyle, Point } from './interfaces'
import {NodeCanvasRenderingContext2D} from "canvas";

export class Feature {
    worldData: Point[];
    layerData!: Point[];
    styles!: DrawStyle;

    constructor(worldData: Point[], styles?: DrawStyle) {
        this.worldData = worldData;
        if (styles !== undefined) this.styles = styles;
    }

    scaleTo(zoomLevel: number) {
        const scalar: number = 2 ** zoomLevel;
        this.layerData = this.worldData.map((p: Point) => ({x: p.x * scalar, y: p.y * scalar}))
        return this;
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