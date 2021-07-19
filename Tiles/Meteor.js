import GroundTile from "./Ground.js";
import { MeteorEntity } from "../Entities/index.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";

class MeteorTile extends GroundTile {
    constructor(x, z, groundInit) {
        super(x, z, groundInit);
        this.type = "MeteorTile";
        let ent = this.entity = new MeteorEntity(x, z, {});
        this.addEnts(ent);
        this.setCollisionBox(ent, [COLB_HURT_LAYER]);
    };
    update(timestamp) {
        this.entity.update(timestamp);
        super.update(timestamp);
    };
};

export {
    MeteorTile,
    MeteorTile as default,
};
