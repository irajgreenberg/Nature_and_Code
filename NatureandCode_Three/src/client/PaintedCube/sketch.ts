// Add real time texturing to Three

// Code appropriated from:
// https://threejsfundamentals.org/threejs/lessons/threejs-canvas-textures.html

import { AmbientLight, BoxGeometry, CanvasTexture, Color, DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, PCFSoftShadowMap, PerspectiveCamera, Scene, SphereGeometry, SpotLight, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Get 2D canvas context. By default this type is null.
const ctx = document.createElement('canvas').getContext('2d');

let texture: CanvasTexture;
let cube: Mesh;
let sphere: Mesh;

// ensure ctx is not null throughout code
if (ctx) {
    document.body.appendChild(ctx.canvas);
    ctx.canvas.width = 156;
    ctx.canvas.height = 156;
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
camera.position.z = 7;

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

const ambientTexturesLight = new AmbientLight(0xFFFFFF, .35);
scene.add(ambientTexturesLight);

const col = 0xFFAAFF;
const intensity = 1;
const light = new DirectionalLight(col, intensity);
light.position.set(15.2, 10.2, 12);
light.castShadow = true;
scene.add(light);

const spot = new SpotLight(0xEEEEFF, .6);
spot.position.set(-10, 8, 12);
spot.castShadow = true;
spot.shadow.radius = 8; //doesn't work with PCFsoftshadows
spot.shadow.bias = -0.0001;
spot.shadow.mapSize.width = 1024 * 4;
spot.shadow.mapSize.height = 1024 * 4;
scene.add(spot);


// add test Cube
if (ctx) {
    const boxGeom = new BoxGeometry(3, 3, 3);
    // we know texture is not undefined here, so force TS compiler to accept it using !, the non-null operator
    const boxMat = new MeshPhongMaterial({ map: texture!, color: 0xBB55FF });

    cube = new Mesh(boxGeom, boxMat);
    cube.position.x -= 3;
    cube.position.y += 2;
    scene.add(cube);


    const sphereGeom = new SphereGeometry(2, 17, 17);
    // we know texture is not undefined here, so force TS compiler to accept it using !, the non-null operator
    const sphereMat = new MeshPhongMaterial({ map: texture!, color: 0xBB55FF});

    sphere = new Mesh(sphereGeom, sphereMat);
    sphere.position.x += 3;
    sphere.position.y += 2;
    scene.add(sphere);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    cube.rotateX(Math.PI / 540);
    cube.rotateY(Math.PI / 720);

    sphere.rotateX(-Math.PI / 540);
    sphere.rotateZ(Math.PI / 720);
    drawRandomDot();
    // required to see texture changes each animation frame
    texture.needsUpdate = true;
    render();
}

function render() {
    renderer.render(scene, camera);
}
animate();