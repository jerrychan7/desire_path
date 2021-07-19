
import Entity from "./Entity.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";
import { VertChainsawMod } from "../models/index.js";

class VertChainsawEntity extends Entity {
    constructor(x, z, pathInit, faceZ = false) {
        super(x, z, pathInit);
        this.type = "VertChainsawEntity";
        let mod = this.mod = new VertChainsawMod(faceZ);
        mod.calcCollisionBoxWithoutRotate = true;
        this.addMods(mod);
        this.setCollisionBox(mod, [COLB_HURT_LAYER]);
    };
};

export {
    VertChainsawEntity,
    VertChainsawEntity as default,
};

