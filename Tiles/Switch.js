
import GroundTile from "./Ground.js";
import { SwitchMod, Switch2Mod } from "../models/index.js";
import { COLB_TRIGGER_LAYER } from "../core/CollisionBox.js";

class SwitchTile extends GroundTile {
    constructor(x, z, groundInit, type = 0, {
        activation = false,
        targetTile = null,
    } = {}) {
        super(x, z, groundInit);
        this.type = "SwitchTile";
        this.switchType = type;
        this.switchMod = type == 0? new SwitchMod(activation): new Switch2Mod(activation);
        this.addNeedBeDispose(this.switchMod);
        this.addMods(this.switchMod);
        this.setTargetTile(targetTile);
        this.setCollisionBox(this.switchMod, [COLB_TRIGGER_LAYER]);
    };
    setTargetTile(targetTile) {
        this.targetTile = targetTile;
    };
    get activation() { return this.switchMod.activation; };
    activity(trueOrFalse) {
        this.switchMod.activity(trueOrFalse);
        this.collisionBoxUpdate();
        if (!this.targetTile) return;
        if (this.targetTile.type == "SwitchTile") {
            if (this.targetTile.activation != this.activation)
                this.targetTile.activity(trueOrFalse);
        }
        else this.targetTile.activity && this.targetTile.activity(!trueOrFalse);
    };
};

export {
    SwitchTile,
    SwitchTile as default,
};
