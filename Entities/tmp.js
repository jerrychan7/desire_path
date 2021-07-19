import Entity from "./Entity.js"
import { HorizHexGearMod } from "../models/index.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";

class HorizHexGearEntity extends Entity {
    constructor(x, z, showShadow) {
        super(x, z);
        this.type = "HorizHexGearEntity";
        let mod = new HorizHexGearMod(showShadow);
        this.addMod(mod);
        this.setCollisionBox(mod, [COLB_HURT_LAYER]);
    };
};

export {
    HorizHexGearEntity,
    HorizHexGearEntity as default,
};
