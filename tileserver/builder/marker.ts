import {Feature} from "./feature";
import {NodeCanvasRenderingContext2D} from "canvas";
import {Point} from "./interfaces";

module.exports = class Marker extends Feature {
    makePath(context: NodeCanvasRenderingContext2D, pathData: Point[]) {
        context.beginPath();
        context.arc(pathData[0].x, pathData[0].y, 5, 0, 2 * Math.PI);
    }
}