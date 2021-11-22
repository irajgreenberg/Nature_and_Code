// Add real time texturing using Canvas 2D context

import { AmbientLight, BoxGeometry, CanvasTexture, ClampToEdgeWrapping, Color, DirectionalLight, Mesh, MeshPhongMaterial, PCFSoftShadowMap, PerspectiveCamera, Scene, SphereGeometry, SpotLight, Vector2, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { randRange } from '../NandCUtils'

// Get 2D canvas context. By default this type is null.
const ctx = document.createElement('canvas').getContext('2d');

let texture: CanvasTexture;
let cube: Mesh;
let sphere: Mesh;

const PART_COUNT = 200;
let liveCounter = 0;
let birthRate = .06;
const rad: number[] = [];
let pos: Vector3[] = [];
let spd: Vector3[] = [];
const col: Color[] = [];
const grav: number[] = [];
const GRAVITY = .03;
const particleDistance = 39;

const geomDim = new Vector2(150, 150);
for (let i = 0; i < PART_COUNT; i++) {
    rad[i] = randRange(.02, 2);
    col[i] = new Color(Math.random() * 0xffffff);
    console.log(col[i]);
    spd[i] = new Vector3(randRange(-1.09, 1.09), randRange(-.17, .17), 0);
    pos[i] = new Vector3(geomDim.x / 2, geomDim.y / 2, 0);
    grav[i] = randRange(-.003, .003);
}


// ensure ctx is not null throughout code
if (ctx) {
    ctx.canvas.width = geomDim.x;
    ctx.canvas.height = geomDim.y;
    texture = new CanvasTexture(ctx.canvas);
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
}

function drawRandomDot() {
    if (ctx) {
        // clears shape background for animation
        ctx.fillStyle = 'rgba(105, 220, 115, 0.1)';
        ctx.fillRect(0, 0, 150, 150);

        // draw particles
        for (let i = 0; i < liveCounter; i++) {
            ctx.fillStyle = `rgb(
                ${col[i].r * 255},
                ${col[i].g * 255},
                ${col[i].b * 255})`;

            ctx.beginPath();
            ctx.arc(pos[i].x, pos[i].y, rad[i], 0, Math.PI * 2);
            pos[i].x += spd[i].x;
            spd[i].y += grav[i];
            pos[i].y += spd[i].y;
            ctx.fill();

            // collide with rectangle edges
            if (pos[i].x > geomDim.x - rad[i]) {
                pos[i].x = geomDim.x - rad[i];
                spd[i].x *= -1;
            } else if (pos[i].x < rad[i]) {
                pos[i].x = rad[i];
                spd[i].x *= -1;
            }

            if (pos[i].y > geomDim.y - rad[i]) {
                pos[i].y = geomDim.y - rad[i];
                spd[i].y *= -1;
            } else if (pos[i].y < rad[i]) {
                pos[i].y = rad[i];
                spd[i].y *= -1;
            }

            ctx.strokeStyle = 'orange';
            ctx.lineWidth = .1
            for (let j = 0; j < liveCounter; j++) {
                if (i !== j) {
                    let x = pos[i].x - pos[j].x
                    let y = pos[i].y - pos[j].y
                    // draw lines between nearby particles
                    if (Math.sqrt(x * x + y * y) < particleDistance) {
                        ctx.beginPath();       // Start a new path
                        ctx.moveTo(pos[i].x, pos[i].y);    // Move the pen to (30, 50)
                        ctx.lineTo(pos[j].x, pos[j].y);  // Draw a line to (150, 100)
                        ctx.stroke();
                    }
                }

            }
        }
        if (liveCounter < PART_COUNT - birthRate) {
            liveCounter += birthRate;
        }
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

const col2 = 0xFFAAFF;
const intensity = 1;
const light = new DirectionalLight(col2, intensity);
light.position.set(15.2, 10.2, 12);
light.castShadow = true;
scene.add(light);
3
const spot = new SpotLight(0xEEEEFF, .6);
spot.position.set(-10, 8, 12);
spot.castShadow = true;
spot.shadow.radius = 8; //doesn't work with PCFsoftshadows
spot.shadow.bias = -0.0001;
spot.shadow.mapSize.width = 1024 * 4;
spot.shadow.mapSize.height = 1024 * 4;
scene.add(spot);


// add Cube
if (ctx) {
    const boxGeom = new BoxGeometry(3, 3, 3);
    // we know texture is not undefined here, so force TS compiler to accept it using !, the non-null operator
    const boxMat = new MeshPhongMaterial({ map: texture!, color: 0xBB55FF });

    cube = new Mesh(boxGeom, boxMat);
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