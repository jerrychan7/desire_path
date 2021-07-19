// import * as THREE from "three";
import * as models from "../models/index.js";
const { playerSize } = models.PlayerMod, { crystalHeight, heightOffGround } = models.CrystalMod;
const bigCrystalHeight = models.BigCrystalMod.crystalHeight, bigHeightOffGround = models.BigCrystalMod.heightOffGround;
const hugeCrystalHeight = models.HugeCrystalMod.crystalHeight, hugeHeightOffGround = models.HugeCrystalMod.heightOffGround;
const { blueCrystalMat, purpleCrystalMat} = models;
import { scene } from "./threeApp.js";

const Nebula = window.Nebula;

export let particleSystem = new Nebula.System();
particleSystem.addRenderer(new Nebula.MeshRenderer(scene, THREE));

const crystalParticle = new THREE.Mesh(new THREE.TetrahedronGeometry(0.25), blueCrystalMat);
const bigCrystalParticle = new THREE.Mesh(new THREE.TetrahedronGeometry(0.4), purpleCrystalMat);
const hugeCrystalParticle = new THREE.Mesh(new THREE.TetrahedronGeometry(0.5), purpleCrystalMat);

const dieGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
const dieParticles = [
    new THREE.Mesh(dieGeo, new THREE.MeshLambertMaterial({ color: 0xA8A8A8, })),
    new THREE.Mesh(dieGeo, new THREE.MeshLambertMaterial({ color: 0xDFDFDF, })),
    new THREE.Mesh(dieGeo, new THREE.MeshLambertMaterial({ color: 0xA8A8A8, })),
];

function createEmitter(meshs) {
    const pemitter = new Nebula.Emitter();
    pemitter
        .setRate(new Nebula.Rate(5, 0))
        .addInitializers([
            new Nebula.Body(meshs),
            new Nebula.Mass(100),
            new Nebula.Life(0.25, 0.5),
            new Nebula.RadialVelocity(10, new Nebula.Vector3D(0, 1, 0), 90),
        ])
        .addBehaviours([
            new Nebula.Rotate("random", "random"),
            new Nebula.Scale(1, 0),
            new Nebula.Alpha(1, 0),
            new Nebula.Gravity(20),
        ]);
    return pemitter;
}

const crystalEmitter = createEmitter(crystalParticle);
const bigCrystalEmitter = createEmitter(bigCrystalParticle);
const hugeCrystalEmitter = createEmitter(hugeCrystalParticle);

const dieEmitters = dieParticles.map(dp => createEmitter(dp));
dieEmitters.forEach(de => particleSystem.addEmitter(de.setRate(new Nebula.Rate(2, 0))));

// const dieEmitter = createEmitter(dieParticles);

// console.log(dieEmitters[0].particles);

particleSystem.addEmitter(crystalEmitter).addEmitter(bigCrystalEmitter).addEmitter(hugeCrystalEmitter);

export function die(position, playerColor = null) {
    let {x, z} = position;
    if (playerColor) {
        // console.log(playerColor);
        dieParticles.forEach((dp, i) => dp.material.color = playerColor[i]);
        // dieParticles.forEach(dp => dp.material.color = new THREE.Color(~~(Math.random() * (10 ** 6))));
    }
    dieEmitters.forEach(de => de.setPosition({x, y: playerSize / 2, z}).emit(0.1));
    // setTimeout(() => {console.log(dieEmitters[0].particles[0]);}, 100);
    // dieEmitter.setPosition({x, y: playerSize / 2, z}).emit(0.1);
};
export function crystal(position) {
    let {x, z} = position;
    crystalEmitter.setPosition({x, y: crystalHeight / 2 + heightOffGround, z}).emit(0.1);
};
export function bigCrystal(position) {
    let {x, z} = position;
    bigCrystalEmitter.setPosition({x, y: bigCrystalHeight / 2 + bigHeightOffGround, z}).emit(0.1);
};
export function hugeCrystal(position) {
    let {x, z} = position;
    hugeCrystalEmitter.setPosition({x, y: hugeCrystalHeight / 2 + hugeHeightOffGround, z}).emit(0.1);
};

