import type { DrawStyle, Point } from './interfaces'

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
}