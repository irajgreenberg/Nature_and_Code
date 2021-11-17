import { AmbientLight, BoxGeometry, Color, DirectionalLight, DoubleSide, LinearFilter, Mesh, MeshBasicMaterial, MeshPhongMaterial, NearestFilter, PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, RepeatWrapping, Scene, SpotLight, Texture, TextureLoader, Vector2, Vector3, WebGLRenderer, WebGLRenderTarget } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { randRange } from './NandCUtils'
import { Particle } from './Particle'

const scene = new Scene()
scene.background = new Color(0x221111);

// set up 6 cameras representing, 5 showing views inside the box and 1 camera to view entire scene
const camMain = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camCeiling = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const camFloor = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camBackWall = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const camLeftWall = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const camRightWall = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);

// set up scenes representing, 5 showing views inside the box and 1 camera to view entire scene
const sceneMain = new Scene();
const sceneTextures = new Scene();


const sceneCeiling = new Scene()
const sceneFloor = new Scene()
const sceneBackWall = new Scene()
const sceneLeftWall = new Scene()
const sceneRightWall = new Scene()

// set up 5 render targets
const renderTargetCeiling = new WebGLRenderTarget(window.innerWidth, window.innerHeight);
const renderTargetFloor = new WebGLRenderTarget(window.innerWidth, window.innerHeight);
const renderTargetBackWall = new WebGLRenderTarget(window.innerWidth, window.innerHeight);
const renderTargetLeftWall = new WebGLRenderTarget(window.innerWidth, window.innerHeight);
const renderTargetRightWall = new WebGLRenderTarget(window.innerWidth, window.innerHeight);




// set up cameras
camMain.position.z = 6;

camCeiling.position.y = -1.5;
camCeiling.rotateX(Math.PI / 2);

camFloor.position.y = 1.5;
camFloor.rotateX(-Math.PI / 2);

camBackWall.position.z = 1;

camLeftWall.position.x = 2.5;
camLeftWall.rotateY(Math.PI / 2);

camRightWall.position.x = -2.5;
camRightWall.rotateY(-Math.PI / 2);


// main renderer
let renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement)

// based on main scene camera
const controls = new OrbitControls(camMain, renderer.domElement)

// outer box wireframe (on main scene)
const geometry = new BoxGeometry(5, 3, 3)
const material = new MeshBasicMaterial({
    color: 0xBB55FF,
    wireframe: true,
})
const cube = new Mesh(geometry, material)
let cubeBounds = new Vector3(cube.geometry.parameters.width, cube.geometry.parameters.height, cube.geometry.parameters.depth);

// add cube to main scene
sceneMain.add(cube)

// create particles
const PART_COUNT = 140;
const parts: Particle[] = [];
const partsTexture: Particle[] = [];
for (let i = 0; i < PART_COUNT; i++) {
    let r = randRange(.02, .2);
    let c = Math.random() * 0xffffff;
    let spd = new Vector3(randRange(-.05, .05), randRange(.002, .007), randRange(-.05, .05));
    //parts[i] = new Particle(new Vector3(0, 1.5, 0), r, spd, new Color(c));
    parts[i] = new Particle(new Vector3(0, randRange(-1.25, 1.25), 0), r, spd, new Color(c));

    // sceneMain.add(parts[i]);

    // only add particles to texture scene
    sceneTextures.add(parts[i]);
}

// add Planes (without texture) to main scene
const geomCeiling = new PlaneGeometry(5, 3);
const matCeiling = new MeshPhongMaterial({ color: '0xFF0000', transparent: true, opacity: .8, side: DoubleSide });
const ceiling = new Mesh(geomCeiling, matCeiling);
ceiling.position.y = 1.5
ceiling.rotateX(Math.PI / 2);
ceiling.receiveShadow = true;
sceneTextures.add(ceiling);

const geomFloor = new PlaneGeometry(5, 3);
const matFloor = new MeshPhongMaterial({ color: '0xFF0000', transparent: true, opacity: .8, side: DoubleSide });
const floor = new Mesh(geomFloor, matFloor);
floor.position.y -= 1.5
floor.rotateX(-Math.PI / 2);
floor.receiveShadow = true;
sceneTextures.add(floor);

const geomBackWall = new PlaneGeometry(5, 3);
const matBackWall = new MeshPhongMaterial({ color: '0xFF9900', transparent: true, opacity: .75, side: DoubleSide });
const backWall = new Mesh(geomBackWall, matBackWall);
backWall.position.z -= 1.5
backWall.receiveShadow = true;
sceneTextures.add(backWall);

const geomLeftWall = new PlaneGeometry(3, 3);
const matLeftWall = new MeshPhongMaterial({ color: '0xFF2222', side: DoubleSide });
const leftWall = new Mesh(geomLeftWall, matLeftWall);
leftWall.position.x -= 2.5
leftWall.rotateY(-Math.PI / 2);
leftWall.receiveShadow = true;
sceneTextures.add(leftWall);

const geomRightWall = new PlaneGeometry(3, 3);
const matRightWall = new MeshPhongMaterial({ color: '0xFF0000', transparent: true, opacity: 1, side: DoubleSide });
const rightWall = new Mesh(geomRightWall, matRightWall);
rightWall.position.x = 2.5
rightWall.rotateY(Math.PI / 2);
rightWall.receiveShadow = true;
sceneTextures.add(rightWall);


// Lighting

// ambient light for overall illumination
const ambientSceneLight = new AmbientLight(0xEEEEFF, .3);
//sceneMain.add(ambientSceneLight);

const ambientTexturesLight = new AmbientLight(0xFFFFFF, .15);
sceneTextures.add(ambientTexturesLight);

const color2 = 0xFFAAFF;
const intensity2 = .9;
const light2 = new DirectionalLight(color2, intensity2);
light2.position.set(-1.2, 1.2, 1.2);
light2.castShadow = true;
//sceneMain.add(light2);
sceneTextures.add(light2);

const spot = new SpotLight(0xFF0000, .2);
spot.position.set(0, 1.5, 1.5);
spot.castShadow = true;
spot.shadow.radius = 8; //doesn't work with PCFsoftshadows
spot.shadow.bias = -0.0001;
spot.shadow.mapSize.width = 1024 * 4;
spot.shadow.mapSize.height = 1024 * 4;
sceneTextures.add(spot);

const spot2 = new SpotLight(0xEEEEFF, 1.35);
spot2.position.set(0, .25, 3.5);
spot2.castShadow = true;
spot2.shadow.radius = 8; //doesn't work with PCFsoftshadows
spot2.shadow.bias = -0.0001;
spot2.shadow.mapSize.width = 1024 * 4;
spot2.shadow.mapSize.height = 1024 * 4;
sceneTextures.add(spot2);


// create textures
const floorTextureGeom = new PlaneGeometry(5, 3);
const floorTextureMat = new MeshPhongMaterial({ color: "White", map: renderTargetFloor.texture, transparent: true, opacity: .25, side: DoubleSide });
const floorTexturePlane = new Mesh(floorTextureGeom, floorTextureMat);
floorTexturePlane.position.y -= 1.5
floorTexturePlane.rotateX(-Math.PI / 2);
sceneTextures.add(floorTexturePlane);

const ceilingTextureGeom = new PlaneGeometry(5, 3);
const ceilingTextureMat = new MeshPhongMaterial({ color: "White", map: renderTargetCeiling.texture, transparent: true, opacity: .25, side: DoubleSide });
const ceilingTexturePlane = new Mesh(ceilingTextureGeom, ceilingTextureMat);
ceilingTexturePlane.position.y = 1.5
ceilingTexturePlane.rotateX(Math.PI / 2);
sceneTextures.add(ceilingTexturePlane);

const backWallGeom = new PlaneGeometry(5, 3);
const backWallMat = new MeshPhongMaterial({ color: "White", map: renderTargetBackWall.texture, transparent: true, opacity: .25, side: DoubleSide });
const backWallPlane = new Mesh(backWallGeom, backWallMat);
backWallPlane.position.z = -1.5
sceneTextures.add(backWallPlane);

const leftWallGeom = new PlaneGeometry(3, 3);
const leftWallMat = new MeshPhongMaterial({ color: "White", map: renderTargetLeftWall.texture, transparent: true, opacity: .25, side: DoubleSide });
const leftWallPlane = new Mesh(leftWallGeom, leftWallMat);
leftWallPlane.position.x -= 2.5
leftWallPlane.rotateY(-Math.PI / 2);
// plane.castShadow = true;
leftWallPlane.receiveShadow = true;
sceneTextures.add(leftWallPlane);

const rightWallGeom = new PlaneGeometry(3, 3);
const rightWallMat = new MeshPhongMaterial({ color: "White", map: renderTargetRightWall.texture, transparent: true, opacity: .25, side: DoubleSide });
const rightWallPlane = new Mesh(rightWallGeom, rightWallMat);
rightWallPlane.position.x = 2.5
rightWallPlane.rotateY(-Math.PI / 2);
// plane.castShadow = true;
rightWallPlane.receiveShadow = true;
sceneTextures.add(rightWallPlane);

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camMain.aspect = window.innerWidth / window.innerHeight
    camMain.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)


    //particles
    for (let p of parts) {
        p.move();
        p.collideBounds(cubeBounds);
    }

    // texture particles
    for (let p of partsTexture) {
        p.move();
        p.collideBounds(cubeBounds);
    }

    controls.update()

    render()
}

function render() {
    renderer.setRenderTarget(renderTargetCeiling);
    renderer.render(sceneTextures, camCeiling);
    renderer.setRenderTarget(null);

    renderer.setRenderTarget(renderTargetFloor);
    renderer.render(sceneTextures, camFloor);
    renderer.setRenderTarget(null);

    renderer.setRenderTarget(renderTargetBackWall);
    renderer.render(sceneTextures, camBackWall);
    renderer.setRenderTarget(null);

    renderer.setRenderTarget(renderTargetLeftWall);
    renderer.render(sceneTextures, camLeftWall);
    renderer.setRenderTarget(null);

    renderer.setRenderTarget(renderTargetRightWall);
    renderer.render(sceneTextures, camRightWall);
    renderer.setRenderTarget(null);


    renderer.render(sceneTextures, camMain);
}
animate()
