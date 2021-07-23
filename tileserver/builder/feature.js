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
}
exports.Feature = Feature;
