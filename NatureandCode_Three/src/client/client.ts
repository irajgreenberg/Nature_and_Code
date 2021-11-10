import * as THREE from 'three'
import { Color, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Particle } from './Particle'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 4

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
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
const part = new Particle(new Vector3(0, 1.5, 0), .25, new Vector3(.2, .2, .2), new Color(0x6622bb));
scene.add(part);


window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    part.move();
    part.collideBounds(cubeBounds);

    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}
animate()
