// import * as THREE from "three";
import { scene } from "./threeApp.js";

const GROUND_LAYER = 0;
const HURT_LAYER = 1;
const REWARD_LAYER = 2;
const TRIGGER_LAYER = 3;

const collisionBoxs = [];
window.collisionBoxs = collisionBoxs;

class CollisionBox extends THREE.Box3 {
    static get GROUND_LAYER() { return GROUND_LAYER; };
    static get HURT_LAYER() { return HURT_LAYER; };
    static get REWARD_LAYER() { return REWARD_LAYER; };
    static get TRIGGER_LAYER() { return TRIGGER_LAYER; };
    static intersectsBox(box, layer) {
        let obj = collisionBoxs[layer]?.find(b => b.intersectsBox(box))?.obj;
        return obj?.objReturedAfterCollision || obj || null;
    };
    constructor(module = null, layers = [], {
        showBoxHelper = DEBUGGING,
        boxHelperColor = 0x00ff00,
    } = {}) {
        super();
        this.obj = module;
        this.layers = [];
        this.setLayers(layers);
        this.update();
        if (showBoxHelper) {
            this.boxHelper = new THREE.Box3Helper(this, boxHelperColor);
            scene.add(this.boxHelper);
        }
    };
    setLayers(layers) {
        this.dispose();
        layers.forEach(layer => this.setLayer(layer));
    };
    setLayer(layer) {
        collisionBoxs[layer] = collisionBoxs[layer] || [];
        collisionBoxs[layer].push(this);
        this.layers.push(layer);
        return this;
    };
    update() {
        if (!this.obj) return this;
        this.obj.onBeforeCalcCollisionBox?.();
        this.setFromObject(this.obj.calcCollisionBoxObj || this.obj);
        this.obj.onAfterCalcCollisionBox?.();
        return this;
    };
    dispose() {
        while (this.layers.length) {
            const layer = this.layers.pop(), cl = collisionBoxs[layer];
            cl.splice(cl.indexOf(this), 1);
        }
        this.boxHelper?.removeFromParent();
    };
};


export {
    CollisionBox,
    CollisionBox as default,
    GROUND_LAYER as COLB_GROUND_LAYER,
    HURT_LAYER as COLB_HURT_LAYER,
    REWARD_LAYER as COLB_REWARD_LAYER,
    TRIGGER_LAYER as COLB_TRIGGER_LAYER,
};
