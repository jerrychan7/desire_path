
import GroundTile from "./Ground.js";
import { TreeMod } from "../models/index.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";

class TreeTile extends GroundTile {
    constructor(x, z, groundInit, whiteTop = false) {
        super(x, z, groundInit);
        this.type = "TreeTile";
        this.treeMod = new TreeMod(whiteTop);
        this.addMods(this.treeMod);
        this.setCollisionBox(this.treeMod, [COLB_HURT_LAYER]);
    };
};

export {
    TreeTile,
    TreeTile as default,
};
