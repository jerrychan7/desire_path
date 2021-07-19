import GroundTile from "./Ground.js";
import { VertChainsawEntity } from "../Entities/index.js";
import { VertChainsawTrackMod } from "../models/index.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";

class VertChainsawTile extends GroundTile {
    constructor(x, z, groundInit) {
        super(x, z, groundInit);
        this.type = "VertChainsawTile";
        let ent = this.entity = new VertChainsawEntity(x, z);
        this.addMods(new VertChainsawTrackMod());
        this.addEnts(ent);
        this.setCollisionBox(ent, [COLB_HURT_LAYER]);
    };
    update(timestamp) {
        this.entity.update(timestamp);
        super.update(timestamp);
    };
};

export {
    VertChainsawTile,
    VertChainsawTile as default,
};
