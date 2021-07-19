
import GroundTile from "./Ground.js";
import { UpsideThornMod } from "../models/index.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";

class UpsideThornTile extends GroundTile {
    constructor(x, z, groundInit, {
        fallingSpeed = 2,
        thetaStart = 0,
    } = {}) {
        super(x, z, groundInit);
        this.type = "UpsideThornTile";
        this.thornMod = new UpsideThornMod();
        this.addMods(this.thornMod);
        this.setCollisionBox(this.thornMod, [COLB_HURT_LAYER]);
        this.autoUpdateCollisionBox = true;
        this.i = thetaStart * 360;
        this.fallingSpeed = fallingSpeed;
    };
    get collisionBox() { return super.collisionBox; };
    set collisionBox(box) {
        box.min.y += 0.1;
        super.collisionBox = box;
    };
    update(timestamp) {
        let d = (Math.sin(this.i * Math.PI / 180) + 1) / 2 * 2;
        this.i += this.fallingSpeed;
        this.thornMod.setGroundClearance(d);
        super.update(timestamp);
    };
};

export {
    UpsideThornTile,
    UpsideThornTile as default,
};
