import GroundTile from "./Ground.js";
import { FortEntity } from "../Entities/index.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";

class FortTile extends GroundTile {
    constructor(x, z, groundInit, fortInit) {
        super(x, z, groundInit);
        this.type = "FortTile";
        let ent = this.entity = new FortEntity(x, z, {}, fortInit);
        this.addEnts(ent);
        this.setCollisionBox(ent, [COLB_HURT_LAYER]);
    };
    update(timestamp) {
        this.entity.update(timestamp);
        super.update(timestamp);
    };
};

export {
    FortTile,
    FortTile as default,
};
