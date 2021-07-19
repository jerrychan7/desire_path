import Tile from "./Tile.js";
import { GroundMod,VertChainsawTrackMod } from "../models/index.js";

class GroundTile extends Tile {
    constructor(x = 0, z = 0, {
        hasThorn = false,
        hasChainsawTrack = false,
        chainsawTrackFaceZ =  false,
        groundMovable = false,
        groundMoveDir = GroundTile.DIR_NX,
        groundVelocity = 0.4,
    } = {}) {
        super(x, z);
        this.type = "GroundTile";
        let mod = new GroundMod(hasThorn);
        this.addMods(mod);
        if (hasChainsawTrack) {
            this.hasChainsawTrack = hasChainsawTrack;
            this.addMods(new VertChainsawTrackMod(chainsawTrackFaceZ));
        }
        this.setGroundCollisionBox(mod);
        this.groundMovable = groundMovable;
        if (groundMovable) {
            this.groundMoveDir = groundMoveDir;
            this.autoUpdateCollisionBox = true;
            this.groundVelocity = groundVelocity / 1000;
        }
    };
    update(timestamp) {
        if (this.groundMovable) {
            if (timestamp == 0 || this.lastUpdateTimestamp == 0)
                this.lastUpdateTimestamp = timestamp;
            let {x, z} = this.getPosition();
            if (Math.abs(this.initX - x) > 30 || Math.abs(this.initZ - z) > 30) return this.dispose();
            let dt = timestamp - this.lastUpdateTimestamp;
            this.addPosition(this.groundMoveDir.clone().multiplyScalar(this.groundVelocity * dt));
        }
        super.update(timestamp);
    };
};

export {
    GroundTile,
    GroundTile as default,
};
