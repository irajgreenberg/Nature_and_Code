// Add real time texturing to Three

// Code appropriated from:
// https://threejsfundamentals.org/threejs/lessons/threejs-canvas-textures.html

import { BoxGeometry, CanvasTexture, Color, Mesh, MeshBasicMaterial, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Get 2D canvas context. By default this type is null.
const ctx = document.createElement('canvas').getContext('2d');

let texture: CanvasTexture;
let cube: Mesh;

// ensure ctx is not null throughout code
if (ctx) {
    document.body.appendChild(ctx.canvas);
    ctx.canvas.width = 256;
    ctx.canvas.height = 256;
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    texture = new CanvasTexture(ctx.canvas);
}

// requires 1 arg, with 2nd max optional
function randInt(min: number, max?: number) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.random() * (max - min) + min | 0;
}

function drawRandomDot() {
    if (ctx) {
        ctx.fillStyle = `rgb(
        ${Math.floor(Math.random() * 256)},
        ${Math.floor(Math.random() * 256)},
        ${Math.floor(Math.random() * 256)}
        )`
        // alternate way to generate random color value
        // ctx.fillStyle = `#${randInt(0x1000000).toString(16).padStart(6, '0')}`;

        ctx.beginPath();
        const x = randInt(256);
        const y = randInt(256);
        const radius = randInt(10, 64);
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// create and position camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const scene = new Scene();
scene.background = new Color(0xAABBFF);

// main renderer
let renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// based on main scene camera
const controls = new OrbitControls(camera, renderer.domElement);

// add test Cube
if (ctx) {
    const boxGeom = new BoxGeometry(3, 3, 3);
    // we know texture is not undefined here, so force TS compiler to accept it using !, the non-null operator
    const boxMat = new MeshBasicMaterial({ map: texture!, color: 0xBB55FF });

    cube = new Mesh(boxGeom, boxMat)
    scene.add(cube);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    cube.rotateX(Math.PI / 540);
    cube.rotateY(Math.PI / 720);
    drawRandomDot();
    // required to see texture changes each animation frame
    texture.needsUpdate = true;
    render();
}

function render() {
    renderer.render(scene, camera);
}
animate();