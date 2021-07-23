"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerDisplay = void 0;
const lit_1 = require("lit");
const decorators_js_1 = require("lit/decorators.js");
const style_map_js_1 = require("lit/directives/style-map.js");
let LayerDisplay = class LayerDisplay extends lit_1.LitElement {
    constructor() {
        super(...arguments);
        this.showGrid = true;
    }
    tileUrl(x, y) {
        return this.endpoint
            .replace('{X}', x.toString())
            .replace('{Y}', y.toString())
            .replace('{Z}', this.zoom.toString());
    }
    get sideLength() {
        return 2 ** this.zoom;
    }
    renderTiles() {
        const tiles = [];
        for (const y in [...Array(this.sideLength).keys()]) {
            for (const x in [...Array(this.sideLength).keys()]) {
                // tiles.push(html``);
                tiles.push(lit_1.html `<div class="tile"><img src="${this.tileUrl(parseInt(x), parseInt(y))}" alt="(${x}, ${y})"></div>`);
            }
        }
        return tiles;
    }
    render() {
        const gridStyles = {
            'grid-template-rows': `repeat(${this.sideLength}, 1fr)`,
            'grid-template-columns': `repeat(${this.sideLength}, 1fr)`,
            'gap': this.showGrid ? '2px' : '0'
        };
        return lit_1.html `
            <div class="wrapper">
                <div>
                    <span>Zoom Level: ${this.zoom}</span>
                </div>
                <div class="grid" style="${style_map_js_1.styleMap(gridStyles)}">${this.renderTiles()}</div>
            </div>
        `;
    }
};
// Styles are scoped to this element: they won't conflict with styles
// on the main page or in other components. Styling API can be exposed
// via CSS custom properties.
LayerDisplay.styles = lit_1.css `
    :host {
        display: flex;
        justify-content: center;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        background: var(--bs-gray-dark);
        padding: 0.5rem;
        gap: 0.5rem;
    }

    .grid {
        display: grid;
        width: 85vh;
        height: 85vh;
    }
    .tile {
        display: block;
        line-height: 0;
    }

    .tile img {
        max-width: 100%;
    }
  `;
__decorate([
    decorators_js_1.property({ type: Number })
], LayerDisplay.prototype, "zoom", void 0);
__decorate([
    decorators_js_1.property({ type: String })
], LayerDisplay.prototype, "endpoint", void 0);
__decorate([
    decorators_js_1.state()
], LayerDisplay.prototype, "showGrid", void 0);
LayerDisplay = __decorate([
    decorators_js_1.customElement("layer-display")
], LayerDisplay);
exports.LayerDisplay = LayerDisplay;
