// import * as THREE from "three";
import GameObj from "../core/GameObj.js";
import CollisionBox from "../core/CollisionBox.js";
import { constants } from "../models/index.js";
const { groundSize } = constants;

export const DIR_PX = new THREE.Vector3(1, 0, 0);
export const DIR_PZ = new THREE.Vector3(0, 0, 1);
export const DIR_NX = new THREE.Vector3(-1, 0, 0);
export const DIR_NZ = new THREE.Vector3(0, 0, -1);

const entities = [];

class Entity extends GameObj {
    static get DIR_PX() { return DIR_PX; };
    static get DIR_PZ() { return DIR_PZ; };
    static get DIR_NX() { return DIR_NX; };
    static get DIR_NZ() { return DIR_NZ; };
    constructor(x = 0, z = 0, {
        pathPos = [],
        pathClosed = true,
        pathType = "catmullrom",
        pathTension = 0,
        pathDuration = 1000,
        pathInterval = 0,
        pathThetaStart = 0,
        autoUpdateCollisionBox = true,
    } = {}) {
        super();
        this.type = "Entity";
        this.initX = x; this.initZ = z;
        this.setPosition({x, z});
        this.autoUpdateCollisionBox = autoUpdateCollisionBox;
        if (pathPos.length) {
            let dPos = (new THREE.Vector3(x, 0, z)).sub(new THREE.Vector3(...pathPos[0]));
            this.path = new THREE.CatmullRomCurve3(
                pathPos.map(v => {
                    let vec = new THREE.Vector3(...v);
                    vec.add(dPos);
                    return vec;
                }), pathClosed, pathType, pathTension);
            // console.log(this, x, z, dPos, pathPos[0])
            this.pathDuration = pathDuration;
            this.pathInterval = pathInterval;
            this.pathThetaStart = pathThetaStart;
            // console.log(pathThetaStart)
            this.i = 0;
            this.pathLastTimestamp = 0;
        }
    };
    getPosition() {
        // return this.position.clone().divideScalar(groundSize);
        let {x, y, z} = this.position;
        return new THREE.Vector3(x / groundSize, y / groundSize, z / groundSize);
    };
    setPosition({x = 0, y = 0, z = 0} = {}) {
        this.position.set(x * groundSize, y * groundSize, z * groundSize);
        return this;
    };
    addPosition({x = 0, y = 0, z = 0} = {}) {
        this.position.add(new THREE.Vector3(x * groundSize, y * groundSize, z * groundSize));
        return this;
    };
    addMods(...mods) {
        mods.forEach(obj => obj.dispose && this.addNeedBeDispose(obj));
        return super.add(...mods);
    };
    get collisionBox() { return this._collisionBox; };
    set collisionBox(box) { this._collisionBox = box; };
    setCollisionBox(mod = this, layers = [], {
        showBoxHelper,
        boxHelperColor = 0x00ff00,
    } = {}) {
        this.disposeCollisionBox();
        this.updateMatrixWorld();
        const cbox = this.collisionBox = new CollisionBox(mod, layers, { boxHelperColor, showBoxHelper, });
        return cbox;
    };
    collisionDetection(layer) {
        if (!this.collisionBox) return null;
        return CollisionBox.intersectsBox(this.collisionBox, layer);
    };
    disposeCollisionBox() {
        this.collisionBox && this.collisionBox.dispose();
    };
    dispose() {
        if (this.disposed) return false;
        this.disposeCollisionBox();
        return super.dispose();
    };
    collisionBoxUpdate() {
        if (this.collisionBox) {
            this.updateMatrixWorld();
            this.collisionBox = this.collisionBox.update();
        }
    };
    update(timestamp) {
        if (this.path) {
            if (timestamp == 0 || this.pathLastTimestamp == 0)
                this.pathLastTimestamp = timestamp;
            let dt = timestamp - this.pathLastTimestamp + this.pathThetaStart;
            this.i = dt / this.pathDuration;
            if (this.i > 1) {
                this.pathThetaStart = 0;
                if (dt < this.pathInterval + this.pathDuration) {
                    this.i = 1;
                }
                else {
                    this.i = 0;
                    this.pathLastTimestamp = timestamp;
                }
            }
            let v = this.path.getPointAt(this.i);
            this.setPosition(v);
        }
        if (this.autoUpdateCollisionBox) this.collisionBoxUpdate();
        super.update(timestamp);
    };
};

export {
    Entity,
    Entity as default,
};
