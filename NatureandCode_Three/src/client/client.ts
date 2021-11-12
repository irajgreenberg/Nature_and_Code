import * as THREE from 'three'
import { Color, DoubleSide, Mesh, MeshPhongMaterial, PCFSoftShadowMap, PlaneGeometry, SpotLight, TextureLoader, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { randRange } from './NandCUtils'
import { Particle } from './Particle'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 4

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry(5, 3, 3)
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
console.log(cube.geometry.parameters.width);
scene.add(cube)
let cubeBounds = new Vector3(cube.geometry.parameters.width, cube.geometry.parameters.height, cube.geometry.parameters.depth);


//create particle
//  const part = new Particle(new Vector3(0, 1.5, 0), .15, new Vector3(.02, .02, .02), new Color(0x6622bb));
//  scene.add(part);

const PART_COUNT = 50;
const parts: Particle[] = [];
for (let i = 0; i < PART_COUNT; i++) {
    let r = randRange(.01, .3);
    let c = Math.random()*0xffffff;
    let spd = new Vector3(randRange(-.01, .01), randRange(-.007, .007), randRange(-.01, .01));
    parts[i] = new Particle(new Vector3(0, 1.5, 0), r, spd, new Color(c));
    scene.add(parts[i]);
}

// add ground plane
// ground plane
const geomPlane = new PlaneGeometry(5, 3);
const matPlane = new MeshPhongMaterial({ color: 0x222222, opacity: 1, side: DoubleSide });
//material.opacity = 0.5;

const plane = new Mesh(geomPlane, matPlane);
plane.position.y-=1.5
plane.rotateX(-Math.PI / 2);
// plane.castShadow = true;
plane.receiveShadow = true;

const texture = new TextureLoader().load("woodTile.jpg"); // in client directory next to index
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(4, 4);
plane.material.map = texture;
scene.add(plane);

// Simple lighting calculations
const color = 0xFFFFFF;
const intensity = .75;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

const color2 = 0xFFFFFF;
const intensity2 = 1;
const light2 = new THREE.DirectionalLight(color, intensity);
light2.position.set(-2, 20, 12);
light2.castShadow = true;
scene.add(light2);

const spot = new SpotLight(0xFFFFFF, 5);
spot.position.set(-30, 300, 50);
spot.castShadow = true;
spot.shadow.radius = 8; //doesn't work with PCFsoftshadows

spot.shadow.bias = -0.0001;
spot.shadow.mapSize.width = 1024 * 4;
spot.shadow.mapSize.height = 1024 * 4;
scene.add(spot);

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    for (let p of parts) {
        p.move();
        p.collideBounds(cubeBounds);
    }
    //    part.move();
    //     part.collideBounds(cubeBounds);

    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}
animate()
