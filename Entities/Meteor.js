import Entity from "./Entity.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";
import { MeteorMod } from "../models/index.js";

class MeteorEntity extends Entity {
    constructor(x, z, pathInit) {
        super(x, z, pathInit);
        this.type = "MeteorEntity";
        let mod = this.mod = new MeteorMod();
        mod.calcCollisionBoxWithoutRotate = true;
        this.addMods(mod);
        this.setCollisionBox(mod, [COLB_HURT_LAYER]);
    };
};

export {
    MeteorEntity,
    MeteorEntity as default,
};
