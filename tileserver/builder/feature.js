"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
const { lineString, polygon } = require('@turf/helpers');
const bboxClip = require('@turf/bbox-clip');
class Feature {
    constructor(worldData, styles) {
        // TODO: pass geometry variable to constructor and parse worldData here
        this.worldData = worldData;
        if (styles !== undefined)
            this.styles = styles;
    }
    static fromGeoJson(geoJson) {
    }
    getGeom() {
        const path = this.layerData.map(p => [p.x, p.y]);
        if (this.styles.fillStyle)
            return polygon([path]);
        else
            return lineString(path);
    }
    // getPath(geom: Polygon|LineString) {
    //     if(geom.type === "Polygon") return getCoords([path]);
    //     else return lineString(path);
    // }
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
        this.layerBbox = [minX ?? 0, minY ?? 0, maxX ?? 0, maxY ?? 0];
        return this;
    }
    clip(box) {
        return bboxClip(this.getGeom(), box);
    }
    inBox(box) {
        // no horizontal overlap
        if (this.layerBbox[0] >= box[2] || box[0] >= this.layerBbox[2])
            return false;
        // no vertical overlap
        return !(this.layerBbox[1] >= box[3] || box[1] >= this.layerBbox[3]);
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
