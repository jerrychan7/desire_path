// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
const THREE = window.THREE;
const { OrbitControls } = THREE;
import * as pages from "./Page.js";
import GameObj from "./GameObj.js";
import * as entities from "../Entities/index.js";
import { composer, camera, cameraInitPos, renderer, scene, calcHeightOfView, getHeightOfView, effectType, effectPasses } from "./threeApp.js";
import sounds from "../sounds/index.js";

class Animate {
    constructor() {
        this.stopFlag = true;
        this.timer = null;
    };
    clearTimer() {
        if (!this.timer) return;
        cancelAnimationFrame(this.timer);
        this.timer = null;
    };
    start() {
        this.clearTimer();
        this.stopFlag = false;
        this.onrender();
    };
    stop() {
        this.stopFlag = true;
        this.clearTimer();
    };
    onrender(timestamp = 0) {
        this.update && this.update(timestamp);
        this.render();
        if (!this.stopFlag)
            this.timer = requestAnimationFrame(this.onrender.bind(this));
    };
    render() {
        composer.render();
    };
};

import * as particle from "./particle.js";
const psys = particle.particleSystem;

import * as gameMaps from "./maps.js";


class Game {
    constructor() {
        this.players = [];
        this.animater = new Animate();
        this.animater.update = this.update.bind(this);
        this.listeners = {};
        this.state = "";
        this.overTimestamp = 0;
        this.lastTimestamp = 0;
        // this.cameraV = calcHeightOfView(2.4) / 1000;
        this.cameraV = calcHeightOfView(3.2) / 1000;
        this.score = 0;
    };
    addEventListener(type, listener) {
        this.listeners[type] = this.listeners[type] || [];
        if (!this.listeners[type].includes(listener))
            this.listeners[type].push(listener);
    };
    dispatchEvent(type, ...msg) {
        this.listeners[type] && this.listeners[type].forEach(fn => fn(...msg));
    };
    setLevel(level = -~~(Math.random() * 5)) {
        this.score = 0;
        this.players.forEach(player => player.dispose());
        this.maps && this.maps.dispose();
        GameObj.disposeAll();
        this.level = level;
        let player = new entities.PlayerEntity();
        this.players = [player];
        scene.add(player);
        if (level <= 0) {
            let maps = new gameMaps.GameMap(level, { playerPos: player.position });
            scene.add(maps);
            this.maps = maps;
        }
        else {
            let maps = new gameMaps.GameMap(level, { playerPos: player.position });
            scene.add(maps);
            this.maps = maps;
        }
        if (effectType) renderer.setClearColor(0, 1);
        else renderer.setClearColor(this.maps.backgroundColor, 1);
        camera.position.copy(cameraInitPos);
    };
    showFirstFrame() {
        if (!("level" in this)) {
            this.setLevel();
        }
        this.animater.render();
    };
    init() {
        if (DEBUGGING) {
            // window.THREE = THREE;
            scene.add(new THREE.AxesHelper(10));
            if (OrbitControls)
                new OrbitControls(camera, renderer.domElement);
        }
        let keys = {};
        window.addEventListener("keydown", e => {
            if (this.state !== "playing") return;
            if (!(["KeyA", "KeyD", "ArrowLeft", "ArrowRight"].includes(e.code)))
                return;
            e.preventDefault();
            keys[e.code] = true;
            let dir = new THREE.Vector3(
                ["KeyA", "ArrowLeft"].includes(e.code),
                0,
                ["KeyD", "ArrowRight"].includes(e.code));
            this.players.forEach(player => {
                if (player.moving) return;
                player.startMove(dir);
                sounds["move"].play();
            });
        });
        window.addEventListener("keyup", e => {
            if (!keys[e.code]) return;
            keys[e.code] = false;
        });
        window.addEventListener("touchstart", e => {
            if (this.state !== "playing") return;
            if (e.target != pages.playing.gameCanvas) return;
            e.preventDefault();
            let dir = new THREE.Vector3(
                e.touches[0].clientX < window.innerWidth / 2, 0,
                e.touches[0].clientX >= window.innerWidth / 2
            );
            this.players.forEach(player => {
                if (player.moving) return;
                player.startMove(dir);
                sounds["move"].play();
            });
        }, { passive: false, });

        pages.playing.addEventListener("onshown", msg => {
            if (msg === "init") return;
            if (msg !== undefined || !("level" in this)) {
                this.setLevel(msg);
                pages.playing.setCoverColor(this.maps.backgroundColor);
            }
            this.start();
        });
    };
    start() {
        this.state = "playing";
        this.animater.start();
    };
    pause() {
        this.state = "pause";
        this.animater.stop();
    };
    update(timestamp) {
        if (timestamp == 0 || this.lastTimestamp == 0)
            this.lastTimestamp = timestamp;
        if (this.state == "over" || this.state == "success") {
            psys.update();
            if (this.state == "success") {
                this.players.forEach(player => player.update(timestamp));
            }
            if (timestamp - this.overTimestamp > 700) {
                if (this.state == "over")
                    this.over();
                else if (this.state == "success")
                    this.challengeSuccess();
            }
            return;
        }
        if (this.state !== "playing") return;

        GameObj.updateAll(timestamp);

        let dt = timestamp - this.lastTimestamp;
        camera.position.x += (this.cameraV * dt) / Math.SQRT2;
        camera.position.z += (this.cameraV * dt) / Math.SQRT2;

        for (let i = 0; i < this.players.length; ++i) {
            let player = this.players[i];
            // collision test
            let ground = player.groundCollisionDetection();
            let hurter = player.hurtCollisionDetection();
            let outScreen = false;
            const heightOfView = getHeightOfView();
            let b = camera.position.x - cameraInitPos.x - heightOfView + camera.position.z - cameraInitPos.z - heightOfView;
            if (player.position.x < -player.position.z + b) outScreen = true;
            if (hurter || !ground || outScreen) {
                console.log("player die", hurter, ground);
                particle.die(player.position, player.mod.colors);
                sounds["die"].play();
                player.dispose();
                this.players.splice(i--, 1);
            }
            if (ground && ground.type === "AccZoneTile" && !player.moving) {
                player.startMove(ground.direction, { timeScale: 0.5, });
                sounds["accZone"].play();
            }
            let triggerTile = player.triggerCollisionDetection();
            if (triggerTile) {
                triggerTile.activity && triggerTile.activity(true);
                // console.log(triggerTile)
                if (triggerTile.type == "SwitchTile") {
                    if (triggerTile.switchType == 1) {
                        let p = new entities.PlayerEntity(triggerTile.targetTile.initX, triggerTile.targetTile.initZ);
                        this.players.push(p);
                        scene.add(p);
                        sounds["switch2"].play();
                    }
                    else {
                        sounds["switch"].play();
                    }
                }
            }
            let reward = player.rewardCollisionDetection();
            if (reward && reward.activation) {
                reward.activity && reward.activity();
                console.log("+1", reward.type);
                if (reward.type == "CrystalTile") {
                    particle.crystal(reward.position);
                    localStorage.setItem("currentCrystalCount", Number(localStorage.getItem("currentCrystalCount") || 0) + 1);
                    sounds["crystal"].play();
                }
                else if (reward.type == "BigCrystalTile") {
                    particle.bigCrystal(reward.position);
                    sounds["bigCrystal"].play();
                    localStorage.setItem("currentCrystalCount", Number(localStorage.getItem("currentCrystalCount") || 0) + 10);
                }
                else if (reward.type == "HugeCrystalTile") {
                    particle.hugeCrystal(reward.position);
                    sounds["challengesSuccess"].play();
                    this.state = "success";
                    this.overTimestamp = timestamp;
                }
            }

            // y > kx + b, k = -1
            b = camera.position.x - cameraInitPos.x + 6 + camera.position.z - cameraInitPos.z + 6;
            if (player.position.x > -player.position.z + b) {
                let d = Math.abs(player.position.x + player.position.z - b) / Math.SQRT2;
                camera.position.x = camera.position.x + d;
                camera.position.z = camera.position.z + d;
            }

            let t = player.nowUnit;
            player.nowUnit = this.maps.update(player.getPosition()) || t;
            if (t && t != player.nowUnit) {
                // console.log(t.level, t.subLevel, player.nowUnit.level, player.nowUnit.subLevel, player.getPosition())
                this.score += 1;
                pages.playing.nowScore.innerHTML = this.score;
                sounds["score+1"].play();
            }
        }
        if (this.players.length === 0) {
            console.log("game over");
            this.state = "over";
            this.overTimestamp = timestamp;
            effectPasses.glitch.active = true;
        }

        psys.update();
        this.lastTimestamp = timestamp;
    };
    over() {
        this.dispatchEvent("onover", this.score);
        delete this.level;
        this.animater.stop();
        this.state = "";
    };
    challengeSuccess() {
        this.dispatchEvent("onChallengeSuccess", this.level);
        delete this.level;
        this.animater.stop();
        this.state = "";
    };
};

const game = new Game();
window.asdf = game;

export {
    game,
    game as default,
};
