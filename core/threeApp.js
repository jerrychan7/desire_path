// import * as THREE from "three";
import * as pages from "./Page.js";
import { groundSize, groundFaceSize } from "../models/constants.js";


export let renderer = null;
export let composer = null;

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


export function initLightsGroup() {
    const lights = new THREE.Group();
    lights.add(new THREE.AmbientLight(0xffffff, 0.4));
    let light = new THREE.DirectionalLight(0xffffff, 1);
    // light.position.set(-45, 50, -25);
    light.position.setFromSphericalCoords(10, 42 * Math.PI / 180, 241 * Math.PI / 180);
    lights.add(light);
    light = new THREE.DirectionalLight(0xffffff, 0.1);
    light.position.set(-10, 0, -10);
    lights.add(light);
    return lights;
};

export let scene = new THREE.Scene();

const lights = initLightsGroup();
scene.add(lights);

export let effectType = 0;
export let effectPasses = {
    render: new THREE.RenderPass(scene, camera),
    pixel: new THREE.ShaderPass(THREE.PixelShader),
    sobel: new THREE.ShaderPass(THREE.SobelOperatorShader),
    grayScale: new THREE.ShaderPass(THREE.LuminosityShader),
    dotScreen: new THREE.ShaderPass(THREE.DotScreenShader),
    rgbShift: new THREE.ShaderPass(THREE.RGBShiftShader),
    film: new THREE.FilmPass(0.35, 1, 2048, false),
};
effectPasses.pixel.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
effectPasses.pixel.uniforms["resolution"].value.multiplyScalar(window.devicePixelRatio);
effectPasses.pixel.uniforms["pixelSize"].value = 2 * window.devicePixelRatio;
effectPasses.sobel.uniforms["resolution"].value.x = window.innerWidth * window.devicePixelRatio;
effectPasses.sobel.uniforms["resolution"].value.y = window.innerHeight * window.devicePixelRatio;
effectPasses.dotScreen.uniforms["scale"].value = 4;
effectPasses.rgbShift.uniforms["amount"].value = 0.0015;


export function rendererInit(effect = 0) {
    const firstInit = renderer == null;
    effectType = effect;
    if (firstInit) {
        renderer = new THREE.WebGLRenderer({ canvas: pages.playing.gameCanvas, antialias: true, });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.setClearColor(0x1FAEB4, 1);
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.BasicShadowMap;
        renderer.localClippingEnabled = true;
        // document.body.appendChild(renderer.domElement);
        composer = new THREE.EffectComposer(renderer);
    }
    else {
        Object.values(effectPasses).forEach(pass => {
            composer.removePass(pass);
        });
    }

    composer.addPass(effectPasses.render);

    if (effect == 0) return {renderer, composer};
    if (effect == 1) {
        composer.addPass(effectPasses.pixel);
        composer.addPass(effectPasses.grayScale);
        composer.addPass(effectPasses.sobel);
    }
    else if (effect == 2) {
        composer.addPass(effectPasses.dotScreen);
    }

    composer.addPass(effectPasses.rgbShift);
    composer.addPass(effectPasses.film);

    return {renderer, composer};
};

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
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    composer.setPixelRatio(window.devicePixelRatio);
    effectPasses.pixel.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    effectPasses.pixel.uniforms["resolution"].value.multiplyScalar(window.devicePixelRatio);
    effectPasses.pixel.uniforms["pixelSize"].value = 2 * window.devicePixelRatio;
    effectPasses.sobel.uniforms["resolution"].value.x = window.innerWidth * window.devicePixelRatio;
    effectPasses.sobel.uniforms["resolution"].value.y = window.innerHeight * window.devicePixelRatio;
    composer.render();
}, false);


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
