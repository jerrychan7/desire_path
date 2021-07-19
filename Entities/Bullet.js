
import Entity from "./Entity.js";
import { BulletMod } from "../models/index.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";

const d2r = d => d * Math.PI / 180;

class BulletEntity extends Entity {
    constructor(x = 0, z = 0, {
        direction = BulletEntity.DIR_NX,
        // tile / s
        velocity = 5,
    } = {}) {
        super(x, z);
        this.type = "BulletEntity";
        let mod = new BulletMod();
        if (direction.equals(BulletEntity.DIR_NZ))
            mod.rotateY(d2r(-90));
        if (direction.equals(BulletEntity.DIR_PZ))
            mod.rotateY(d2r(90));
        if (direction.equals(BulletEntity.DIR_PX))
            mod.rotateY(d2r(180));
        this.addMods(mod);
        this.direction = direction;
        this.velocity = velocity / 1000;
        this.setCollisionBox(mod, [COLB_HURT_LAYER]);
    };
    update(timestamp) {
        let {x, z} = this.getPosition();
        if (Math.abs(this.initX - x) > 15 || Math.abs(this.initZ - z) > 15) return this.dispose();
        if (timestamp == 0 || this.lastUpdateTimestamp == 0)
            this.lastUpdateTimestamp = timestamp;
        let dt = timestamp - this.lastUpdateTimestamp;
        this.addPosition(this.direction.clone().multiplyScalar(this.velocity * dt));
        super.update(timestamp);
    };
};

export {
    BulletEntity,
    BulletEntity as default,
};
