"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
class Feature {
    constructor(worldData, styles) {
        this.worldData = worldData;
        if (styles !== undefined)
            this.styles = styles;
    }
    static fromGeoJson(geoJson) {
    }
    scaleTo(zoomLevel) {
        const scalar = 2 ** zoomLevel;
        this.layerData = [];
        let maxX = undefined, minX = undefined, maxY = undefined, minY = undefined;
        for (const p of this.worldData) {
            const point = { x: p.x * scalar, y: p.y * scalar };
            if (maxX === undefined || point.x > maxX)
                maxX = point.x;
            if (minX === undefined || point.x < minX)
                minX = point.x;
            if (maxY === undefined || point.y > maxY)
                maxY = point.y;
            if (minY === undefined || point.y < minY)
                minY = point.y;
            this.layerData.push(point);
        }
        this.layerBbox = { maxX: maxX ?? 0, minX: minX ?? 0, maxY: maxY ?? 0, minY: minY ?? 0 };
        return this;
    }
    inBox(box) {
        // no horizontal overlap
        if (this.layerBbox.minX >= box.maxX || box.minX >= this.layerBbox.maxX)
            return false;
        // no vertical overlap
        if (this.layerBbox.minY >= box.maxY || box.minY >= this.layerBbox.maxY)
            return false;
        return true;
    }
    draw(context, pathData) {
        this.setStyles(context);
        this.makePath(context, pathData);
        this.drawPath(context);
    }
    setStyles(context) {
        context.restore();
        for (const [key, val] of Object.entries(this.styles)) {
            context[key] = val;
        }
    }
    makePath(context, pathData) {
        context.beginPath();
        for (const i in pathData) {
            context[(i === '0') ? 'moveTo' : 'lineTo'](pathData[i].x, pathData[i].y);
        }
    }
    drawPath(context) {
        if (this.styles.fillStyle)
            context.fill();
        if (this.styles.strokeStyle)
            context.stroke();
    }
}
exports.Feature = Feature;
