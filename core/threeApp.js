// import * as THREE from "three";
import * as pages from "./Page.js";
import { groundSize, groundFaceSize } from "../models/constants.js";


export let renderer = null;
export function rendererInit() {
    renderer = new THREE.WebGLRenderer({ canvas: pages.playing.gameCanvas, antialias: true, });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x1FAEB4, 1);
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.localClippingEnabled = true;
    // document.body.appendChild(renderer.domElement);
};


const cos = Math.SQRT2 / (3 ** 0.5);
export const calcHeightOfView = tileNum => cos * tileNum * groundSize;
let aspect = window.innerWidth / window.innerHeight;
export const calcWidthOfView = tileNum => Math.SQRT2 / aspect * tileNum * groundSize;
let frustumSize = Math.max(
    Math.SQRT2 * (5 * groundSize - (groundSize - groundFaceSize)) / aspect,
    cos * (14 * groundSize)
);
export let camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2, frustumSize * aspect / 2,
    frustumSize / 2, frustumSize / -2,
    0.1, 64
);
export const getHeightOfView = () => camera.top * 2 / cos / groundSize;
export let cameraInitPos = new THREE.Vector3(-10, 10, -10);
camera.position.copy(cameraInitPos);
camera.lookAt(0, 0, 0);
window.addEventListener("resize", function() {
    aspect = window.innerWidth / window.innerHeight;
    frustumSize = Math.max(
        Math.SQRT2 * (5 * groundSize - (groundSize - groundFaceSize)) / aspect,
        cos * (14 * groundSize)
    );
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.render(scene, camera);
}, false);


export let scene = new THREE.Scene();


const lights = new THREE.Group();
lights.add(new THREE.AmbientLight(0xffffff, 0.4));
let light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(-45, 50, -25);
light.position.setFromSphericalCoords(10, 42 * Math.PI / 180, 241 * Math.PI / 180);
lights.add(light);
light = new THREE.DirectionalLight(0xffffff, 0.1);
light.position.set(-10, 0, -10);
lights.add(light);
scene.add(lights);



export const audioListener = new THREE.AudioListener();
camera.add(audioListener);
export const audioLoader = new THREE.AudioLoader();
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        audioListener.context.suspend();
    }
    else if (document.visibilityState === "visible") {
        audioListener.context.resume();
    }
});
// The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page. https://goo.gl/7K7WLu    three.module.js:40961
const resumeAudio = () => {
    audioListener.context.resume();
    window.removeEventListener("click", resumeAudio);
};
window.addEventListener("click", resumeAudio);
