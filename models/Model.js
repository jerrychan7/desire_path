import { THREE } from "./utils.js";
import GameObj from "../core/GameObj.js";

class GOModel extends GameObj {
    constructor(...args) {
        super(...args);
        this.type = "GOModel";
        this.calcCollisionBoxWithoutRotate = false;
        this.calcCollisionBoxObj = this;
        this.tmpRotation = this.calcCollisionBoxObj.rotation.clone();
    };
    get objReturedAfterCollision() {
        return this._objReturedAfterCollision || this.parent;
    };
    set objReturedAfterCollision(obj) {
        this._objReturedAfterCollision = obj;
    };
    onBeforeCalcCollisionBox() {
        if (!this.calcCollisionBoxWithoutRotate) return false;
        this.tmpRotation.copy(this.calcCollisionBoxObj.rotation);
        this.calcCollisionBoxObj.rotation.set(0, 0, 0);
        return true;
    };
    onAfterCalcCollisionBox() {
        if (!this.calcCollisionBoxWithoutRotate) return false;
        this.calcCollisionBoxObj.rotation.copy(this.tmpRotation);
        return true;
    };
};
class MeshModel extends THREE.Mesh {
    constructor(...args) {
        super(...args);
        this.type = "MeshModel";
        this.calcCollisionBoxWithoutRotate = false;
        this.calcCollisionBoxObj = this;
        this.tmpRotation = this.calcCollisionBoxObj.rotation.clone();
    };
    get objReturedAfterCollision() {
        return this._objReturedAfterCollision || this.parent;
    };
    set objReturedAfterCollision(obj) {
        this._objReturedAfterCollision = obj;
    };
    onBeforeCalcCollisionBox() {
        if (!this.calcCollisionBoxWithoutRotate) return false;
        this.tmpRotation.copy(this.calcCollisionBoxObj.rotation);
        this.calcCollisionBoxObj.rotation.set(0, 0, 0);
        return true;
    };
    onAfterCalcCollisionBox() {
        if (!this.calcCollisionBoxWithoutRotate) return false;
        this.calcCollisionBoxObj.rotation.copy(this.tmpRotation);
        return true;
    };
    dispose() {};
};

export {
    GOModel,
    MeshModel,
};
