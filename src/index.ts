import * as THREE from 'three'
import { create_cube } from './create_cube'
import { create_plane } from './create_plane'


// Camera
let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 150, 500);

// Scene
let scene = new THREE.Scene();
const cube = create_cube();
const plane = create_plane();
scene.add(cube, plane);

// Renderer
let renderer = new THREE.WebGLRenderer({ antialias: true })
let canvas = renderer.domElement;
{
    const w = Math.min(window.innerWidth, 1536);
	const h = Math.min(window.innerHeight, 864);

    canvas.setAttribute("id", "c");
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.minHeight = '100vh';

    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xF0F0F0);
}

// Add events listen
let mouse_down = false;
let rotate_start_point = new THREE.Vector3(0, 0, 1);
let rotate_end_point = new THREE.Vector3(0, 0, 1);

let window_half_x = window.innerWidth / 2;
let window_half_y = window.innerHeight / 2;
let rotation_speed = 15;
let last_move_time_stamp = 0;
let move_release_time_delta = 50;

let start_point = { x: 0, y: 0 };
let delta_x = 0;
let delta_y = 0;

canvas.addEventListener('mousedown', on_mouse_down);
canvas.addEventListener('resize', on_window_resize);


// Render
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);




function on_mouse_down(event: MouseEvent) {
    // Prevent the default handling behavior of the browser for the current event
    event.preventDefault();

    mouse_down = true;
    start_point = {
        x: event.clientX,
        y: event.clientY
    };

    canvas.addEventListener('mousemove', on_mouse_move);
    canvas.addEventListener('mouseup', on_mouse_up);
    rotate_start_point = project_on_trackball(0, 0).clone();
    rotate_end_point = rotate_start_point.clone();
}

function on_window_resize() {
    window_half_x = window.innerWidth / 2;
    window_half_y = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function on_mouse_move(event: MouseEvent) {
    delta_x = event.clientX - start_point.x;
    delta_y = event.clientY - start_point.y;
    handle_rotation();

    start_point = {
        x: event.clientX,
        y: event.clientY
    };

    last_move_time_stamp = Date.now();
}

function on_mouse_up(event: MouseEvent) {
    if (Date.now() - last_move_time_stamp > move_release_time_delta) {
        delta_x = event.clientX - start_point.x;
        delta_y = event.clientY - start_point.y;
    };

    mouse_down = false;

    canvas.removeEventListener('mousemove', on_mouse_move);
    canvas.removeEventListener('mouseup', on_mouse_up);
}

function handle_rotation() {
    rotate_end_point = project_on_trackball(delta_x, delta_y).clone();
    const rotate_quaternion = rotate_matrix(rotate_start_point, rotate_end_point);

    const object_quaternion = cube.quaternion.clone(); // get object's local rotation
    object_quaternion.multiplyQuaternions(rotate_quaternion, object_quaternion);
    object_quaternion.normalize();
    cube.setRotationFromQuaternion(object_quaternion);

    rotate_end_point = rotate_start_point.clone();
}

function project_on_trackball(touch_x: number, touch_y: number): THREE.Vector3 {
    const mouse_on_ball = new THREE.Vector3(
        clamp(touch_x / window_half_x, -1.0, 1.0),
        clamp(-touch_y / window_half_y, -1.0, 1.0),
        0.0
    );

    const length = mouse_on_ball.length();
    if (length > 1.0) {
        mouse_on_ball.normalize();
    } else {
        mouse_on_ball.z = Math.sqrt(1.0 - length * length);
    }

    return mouse_on_ball;
}

function rotate_matrix(rotate_start: THREE.Vector3, rotate_end: THREE.Vector3): THREE.Quaternion {
    const axis = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const angle = Math.acos(rotate_start.dot(rotate_end) / rotate_start.length() / rotate_end.length());
    if (angle) {
        axis.crossVectors(rotate_start, rotate_end).normalize();
        quaternion.setFromAxisAngle(axis, angle * rotation_speed);
    }

    return quaternion;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function animate() {
    renderer.render(scene, camera);
}
