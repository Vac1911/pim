"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("./feature");
module.exports = class Marker extends feature_1.Feature {
    makePath(context, pathData) {
        context.beginPath();
        context.arc(pathData[0].x, pathData[0].y, 5, 0, 2 * Math.PI);
    }
};
