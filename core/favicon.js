// import * as THREE from "three";
import GameObj from "./GameObj.js";
import * as gameMaps from "./maps.js";
import { PlayerMod, constants } from "../models/index.js";
const { groundSize, groundFaceSize } = constants;

export function init() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(48, 48);
    const scene = new THREE.Scene();
    let maps = new gameMaps.GameMap("favicon.ico");
    let player = new PlayerMod(0);
    maps.getTile(1, 0).treeMod.scale.set(1.2, 1.2, 1.2);
    maps.getTile(1, 1).crystalMod.scale.set(1.2, 1.2, 1.2);
    maps.getTile(1, 1).crystalMod.crystal.position.set(-0.05, 0, -0.05);
    maps.getTile(1, 1).crystalMod.crystal.scale.set(1.05, 0.9, 1.05);
    maps.getTile(1, 1).crystalMod.shadow.scale.set(1.25, 1.25, 1);
    maps.getTile(1, 1).crystalMod.crystal.onBeforeRender = () => {};
    player.scale.set(1.3, 1.3, 1.3);
    let g = new THREE.Group();
    scene.add(g.add(maps, player));
    renderer.setClearColor(maps.backgroundColor, 1);
    const lights = new THREE.Group();
    lights.add(new THREE.AmbientLight(0xffffff, 0.4));
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.setFromSphericalCoords(10, 42 * Math.PI / 180, 241 * Math.PI / 180);
    lights.add(light);
    light = new THREE.DirectionalLight(0xffffff, 0.1);
    light.position.set(-10, 0, -10);
    lights.add(light);
    scene.add(lights);
    const cos = (2 / 3) ** 0.5;
    const camera = new THREE.OrthographicCamera(
        // (groundSize + groundFaceSize) * Math.SQRT2 / -2, (groundSize + groundFaceSize) * Math.SQRT2 / 2,
        groundSize * 2.5 * cos / -2, groundSize * 2.5 * cos / 2,
        groundSize * 2.5 * cos / 2, groundSize * 2.5 * cos / -2
    );
    camera.position.set(-10, 10, -10);
    camera.lookAt(0, 0, 0);
    g.position.set(-groundSize / 2 - groundSize * 0.13, 0, -groundSize / 2 + groundSize * 0.13);
    renderer.render(scene, camera);
    GameObj.disposeAll();
    const url = renderer.domElement.toDataURL();
    document.getElementById("favicon").href = url;
};
