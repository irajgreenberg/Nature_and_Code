import { Color, Scene, Vector2 } from "three";
import { Context } from "vm";

export class NCTexture {

    doc: Document;
    size: Vector2;
    ctx: CanvasRenderingContext2D | null;
    pixels: Color[] = [];
    canvas: HTMLCanvasElement;


    constructor(doc: Document, size: Vector2) {
        this.doc = doc;
        this.size = size;

        this.canvas = doc.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = size.x;
        this.canvas.height = size.y;
    }

    loadPixels() {
        for (let i = 0, k = 0; i < this.size.x; i++) {
            for (let j = 0; j < this.size.y; j++) {
                k = this.size.y * i + j;
                this.pixels[k] = new Color(0XFFFFFF);
            }
        }
    }

    updatePixels() {
        for (let i = 0, k = 0; i < this.size.x; i++) {
            for (let j = 0; j < this.size.y; j++) {
                k = this.size.y * i + j;
                (this.ctx as CanvasRenderingContext2D).fillStyle = '0xff00ff';
                (this.ctx as CanvasRenderingContext2D).fillRect(i, j, 1, 1);
            }
        }
    }
}