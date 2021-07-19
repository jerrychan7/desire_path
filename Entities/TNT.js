import Entity from "./Entity.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";
import { TNTMod } from "../models/index.js";

class TNTEntity extends Entity {
    constructor(x, z, {
        pathPos,
        pathClosed,
        pathType,
        pathTension,
        pathDuration,
        pathInterval,
        pathThetaStart,
    } = {}) {
        super(x, z, { pathPos, pathClosed, pathType, pathTension, pathDuration, pathInterval, pathThetaStart, });
        this.type = "TNTEntity";
        let mod = new TNTMod();
        this.addMods(mod);
        this.setCollisionBox(mod, [COLB_HURT_LAYER]);
    };
};

export {
    TNTEntity,
    TNTEntity as default,
};
