
import Tile from "./Tile.js";
import { AccZoneMod } from "../models/index.js";

class AccZoneTile extends Tile {
    constructor(x = 0, z = 0, {
        direction = AccZoneTile.DIR_PX,
    } = {}) {
        super(x, z);
        this.type = "AccZoneTile";
        let accZone = this.accZoneMod = new AccZoneMod();
        if (direction.equals(AccZoneTile.DIR_NZ))
            this.rotateY(90 * Math.PI / 180);
        if (direction.equals(AccZoneTile.DIR_PZ))
            this.rotateY(-90 * Math.PI / 180);
        if (direction.equals(AccZoneTile.DIR_NX))
            this.rotateY(180 * Math.PI / 180);
        this.direction = direction;
        this.addMods(accZone);
        this.setGroundCollisionBox(accZone);
    };
};

export {
    AccZoneTile,
    AccZoneTile as default,
};
