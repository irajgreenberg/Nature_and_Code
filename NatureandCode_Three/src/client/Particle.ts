import { Color, Group, Mesh, MeshBasicMaterial, SphereBufferGeometry, Vector3 } from "three";

const GRAVITY = .03;
const DAMPING = .75;


export class Particle extends Group {
    pos: Vector3;
    radius: number;
    spd: Vector3;
    color: Color;

    part: Mesh;

    constructor(pos: Vector3, radius: number, spd: Vector3, color: Color) {
        super();
        this.pos = pos;
        this.radius = radius;
        this.spd = spd;
        this.color = color;

        const partGeom = new SphereBufferGeometry(this.radius);
        const partMat = new MeshBasicMaterial({ color: this.color });
        this.part = new Mesh(partGeom, partMat);
        this.add(this.part);
    }

}