import * as THREE from "three";
import { Color, Group, Mesh, MeshBasicMaterial, Vector2 } from "three";


// Simulates a pixel, as in Processing
export class Pixel extends Group {

    color: Color;
    size: Vector2;

    constructor(color: Color = new Color(0x000000), size: Vector2 = new Vector2(1, 1)) {
        super();
        this.color = color;
        this.size = size;

        let geom = new THREE.PlaneGeometry(size.x, size.y, 1, 1);
        let mat = new MeshBasicMaterial({ color: this.color, side: THREE.DoubleSide });

        // add to scenegraph
        this.add(new Mesh(geom, mat));
    }

}