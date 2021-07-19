
import GroundTile from "./Ground.js";
import { ThornMod } from "../models/index.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";

class ThornTile extends GroundTile {
    constructor(x, z, groundInit, activation = true) {
        super(x, z, { ...groundInit, hasThorn: true });
        this.type = "ThornTile";
        let tmod = this.thornMod = new ThornMod(activation);
        this.addMods(tmod);
        this.setCollisionBox(this.thornMod, [COLB_HURT_LAYER]);
    };
    get collisionBox() { return super.collisionBox; };
    set collisionBox(box) {
        box.max.y -= ThornMod.exposedHeight;
        super.collisionBox = box;
    };
    get activation() { return this.thornMod.activation; };
    activity(trueOrFalse = !this.activation) {
        this.thornMod.activity(trueOrFalse);
        this.collisionBoxUpdate();
    };
};

export {
    ThornTile,
    ThornTile as default,
};

