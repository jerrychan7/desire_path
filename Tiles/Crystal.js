import GroundTile from "./Ground.js";
import { CrystalMod, BigCrystalMod, HugeCrystalMod } from "../models/index.js";
import { COLB_REWARD_LAYER } from "../core/CollisionBox.js";

class CrystalTileBase extends GroundTile {
    constructor(Mod, x, z, groundInit, activation = true) {
        super(x, z, groundInit);
        this.type = "CrystalTileBase";
        this.crystalMod = new Mod();
        this.crystalMod.calcCollisionBoxWithoutRotate = true;
        this.addMods(this.crystalMod);
        this.activity(activation);
    };
    activity(trueOrFalse = false) {
        this.activation = trueOrFalse;
        this.crystalMod.visible = trueOrFalse;
        if (trueOrFalse) this.setCollisionBox();
        else this.collisionBox.dispose();
    };
    setCollisionBox() { return super.setCollisionBox(this.crystalMod, [COLB_REWARD_LAYER]); };
};

class CrystalTile extends CrystalTileBase {
    constructor(x, z, activation = true) {
        super(CrystalMod, x, z, activation);
        this.type = "CrystalTile";
    };
};
class BigCrystalTile extends CrystalTileBase {
    constructor(x, z, activation = true) {
        super(BigCrystalMod, x, z, activation);
        this.type = "BigCrystalTile";
    };
};
class HugeCrystalTile extends CrystalTileBase {
    constructor(x, z, activation = true) {
        super(HugeCrystalMod, x, z, activation);
        this.type = "HugeCrystalTile";
    };
};

export {
    CrystalTile,
    BigCrystalTile,
    HugeCrystalTile,
};
