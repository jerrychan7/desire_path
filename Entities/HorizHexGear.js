import Entity from "./Entity.js"
import { HorizHexGearMod } from "../models/index.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";

class HorizHexGearEntity extends Entity {
    constructor(x, z, pathInit, showShadow = false, scale = 1) {
        super(x, z, pathInit);
        this.type = "HorizHexGearEntity";
        let mod = this.mod = new HorizHexGearMod(showShadow);
        mod.calcCollisionBoxWithoutRotate = true;
        mod.scale.set(scale, scale, scale);
        this.addMods(mod);
        this.setCollisionBox(mod, [COLB_HURT_LAYER]);
    };
};

export {
    HorizHexGearEntity,
    HorizHexGearEntity as default,
};
