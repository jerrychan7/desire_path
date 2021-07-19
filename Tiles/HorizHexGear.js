import GroundTile from "./Ground.js";
import { HorizHexGearEntity } from "../Entities/index.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";

class HorizHexGearTile extends GroundTile {
    constructor(x, z, groundInit, scale) {
        super(x, z, groundInit);
        this.type = "HorizHexGearTile";
        let ent = this.entity = new HorizHexGearEntity(x, z, {}, true, scale);
        this.addEnts(ent);
        this.setCollisionBox(ent, [COLB_HURT_LAYER]);
    };
    update(timestamp) {
        this.entity.update(timestamp);
        super.update(timestamp);
    };
};

export {
    HorizHexGearTile,
    HorizHexGearTile as default,
};
