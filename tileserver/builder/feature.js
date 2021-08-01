"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
class Feature {
    constructor(worldData, styles) {
        this.worldData = worldData;
        if (styles !== undefined)
            this.styles = styles;
    }
    scaleTo(zoomLevel) {
        const scalar = 2 ** zoomLevel;
        this.layerData = this.worldData.map((p) => ({ x: p.x * scalar, y: p.y * scalar }));
        return this;
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
