
// import * as THREE from "three";

const SQRT3 = (3 ** 0.5);
const SQRT2 = Math.SQRT2;
const SQRT2_3 = (2 / 3) ** 0.5;

const geos = [
    new THREE.BoxGeometry(1, 1 / 3, 1).translate(0, 1 / 3, 0),
    new THREE.BoxGeometry(1, 1 / 3, 1),
    new THREE.BoxGeometry(1, 1 / 3, 1).translate(0, -1 / 3, 0),
];
class PlayerMod extends THREE.Group {
    constructor(colors = [0xff00ff, 0xffff00, 0x00ffff]) {
        super();
        this.add(...geos.map((geo, i) => new THREE.Mesh(geo, new THREE.MeshLambertMaterial({
            color: colors[i] || 0xffffff,
        }))));
    };
    changeColors(colors = []) {
        colors.forEach((color, level) => {
            this.changeColor(level, color);
        });
    };
    changeColor(level, color) {
        color = new THREE.Color(color);
        this.children[level].material.color = color;
    };
    dispose() {
        this.children.forEach(mesh => mesh.material.dispose());
    };
};

class PlayerColorSelectRenderer extends THREE.WebGLRenderer {
    constructor(colors) {
        super({ antialias: true, alpha: true, });

        const camera = this.camera = new THREE.OrthographicCamera(
            SQRT2 / -2, SQRT2 / 2,
            SQRT2_3, -SQRT2_3,
        );
        camera.position.set(-10, 10, -10);
        camera.lookAt(0, 0, 0);

        const scene = this.scene = new THREE.Scene();

        const lights = new THREE.Group();
        lights.add(new THREE.AmbientLight(0xffffff, 0.4));
        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.setFromSphericalCoords(10, 42 * Math.PI / 180, 241 * Math.PI / 180);
        lights.add(light);
        light = new THREE.DirectionalLight(0xffffff, 0.1);
        light.position.set(-10, 0, -10);
        lights.add(light);
        scene.add(lights);

        const mod = this.playerMod = new PlayerMod(colors);
        scene.add(mod);
    };
    draw() {
        this.render(this.scene, this.camera);
        return this;
    };
    resize(h, w = h * SQRT3 / 2) {
        this.setPixelRatio(window.devicePixelRatio);
        this.setSize(w, h);
        return this;
    };
    resizeByCanvas(canvas) {
        const style = getComputedStyle(canvas);
        return this.resize(parseFloat(style.height), parseFloat(style.width));
    };
    changeColors(colors = []) {
        this.playerMod.changeColors(colors);
        return this;
    };
    changeColor(level, color) {
        this.playerMod.changeColor(level, color);
        return this;
    };
    dispose() {
        this.playerMod.dispose();
    };
    drawToCanvas(canvas) {
        this.draw();
        canvas.width = this.domElement.width;
        canvas.height = this.domElement.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this.domElement, 0, 0);
        return this;
    };
};
const pcsr = new PlayerColorSelectRenderer();


import { candidatePlayerColor } from "../models/constants.js";
import * as pages from "./Page.js";
function init() {
    const { playerColorOptions } = pages.gameover;
    const getColorCandidatesLockedList = () => localStorage.getItem("colorCandidatesLockedList").split(",").map(i => i === "true");
    const setColorCandidatesLockedList = (i, tf) => {
        let t = getColorCandidatesLockedList();
        t[i] = !!tf;
        localStorage.setItem("colorCandidatesLockedList", t.join(","));
    };
    if (!localStorage.getItem("colorCandidatesLockedList")) {
        localStorage.setItem("colorCandidatesLockedList", candidatePlayerColor.map((_, i) => !i).join(","));
    }
    candidatePlayerColor.forEach((colors, i) => {
        const option = pages.gameover.createPlayerColorOption();
        option.canvas.colors = colors;
        pcsr.changeColors(colors)
            .resizeByCanvas(option.canvas)
            .drawToCanvas(option.canvas);
        if (getColorCandidatesLockedList()[i]) {
            option.classList.add("unlock");
        }
    });
    let lastOption = 0;
    function redraw() {
        for (const option of playerColorOptions.children) {
            pcsr.changeColors(option.canvas.colors)
                .resizeByCanvas(option.canvas)
                .drawToCanvas(option.canvas);
        }
    }
    let needRedraw = false;
    window.addEventListener("resize", () => {
        if (pages.gameover.isShown()) redraw();
        else needRedraw = true;
    });
    function scrollToColor(index) {
        playerColorOptions.scrollTo({
            left: index * (playerColorOptions.children[1].getBoundingClientRect().x - playerColorOptions.children[0].getBoundingClientRect().x),
            behavior: "smooth",
        });
    }
    pages.gameover.addEventListener("onshown", () => {
        scrollToColor(localStorage.getItem("currentPlayerColor") || 0);
    });
    pages.gameover.addEventListener("onbeforeshow", async () => {
        if (!needRedraw) return;
        await redraw();
        needRedraw = false;
    });
    let timerScrollEndDetect = null;
    playerColorOptions.addEventListener("scroll", (e) => {
        clearTimeout(timerScrollEndDetect);
        timerScrollEndDetect = setTimeout(() => {
            const middle = playerColorOptions.getBoundingClientRect().width / 2;
            const options = Array.from(playerColorOptions.children);
            for (let i = 0; i < options.length; ++i) {
                const option = options[i];
                const rect = option.getBoundingClientRect();
                if (middle < rect.left || rect.right < middle) continue;
                if (lastOption == i) break;
                // console.log(i, option.lockIcon.animation);
                options[lastOption].lockIcon.animation.loop = false;
                options[lastOption].classList.remove("highlight");
                lastOption = i;
                if (getColorCandidatesLockedList()[i]) {
                    option.classList.add("unlock");
                    option.lockIcon.animation.loop = false;
                    option.lockIcon.animation.goToAndStop(0);
                    localStorage.setItem("currentPlayerColor", i);
                    break;
                }
                else option.classList.remove("unlock");
                option.lockIcon.animation.loop = true;
                option.lockIcon.animation.play();
                options[lastOption].classList.add("highlight");
            }
        }, 100);
    });
    playerColorOptions.addEventListener("click", (e) => {
        // e.preventDefault();
        let option = e.target;
        if (option === playerColorOptions) return;
        while (option.parentNode !== playerColorOptions)
            option = option.parentNode;
        if (option != playerColorOptions.children[lastOption]) {
            scrollToColor(Array.from(playerColorOptions.children).indexOf(option));
            return;
        }
        if (getColorCandidatesLockedList()[lastOption]) return;
        if (500 > (localStorage.getItem("currentCrystalCount") || 0)) return;
        localStorage.setItem("currentCrystalCount", localStorage.getItem("currentCrystalCount") - 500);
        pages.gameover.currentCrystalCount.innerHTML = localStorage.getItem("currentCrystalCount") || 0;
        setColorCandidatesLockedList(lastOption, true);
        option.classList.add("unlock");
        option.lockIcon.animation.loop = false;
        option.lockIcon.animation.goToAndStop(0);
        localStorage.setItem("currentPlayerColor", lastOption);
    });
}


export {
    PlayerColorSelectRenderer,
    init,
};
