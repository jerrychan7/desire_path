
import Entity from "./Entity.js";
import { PlayerMod, constants } from "../models/index.js";
const { groundSize } = constants;
import CollisionBox from "../core/CollisionBox.js";

class PlayerEntity extends Entity {
    constructor(x, z, playerColor) {
        super(x, z);
        this.type = "PlayerEntity";
        let mod = this.mod = new PlayerMod(playerColor);
        this.addMods(mod);
        this.setCollisionBox(mod);
    };
    startMove(direction, {
        timeScale = 1,
        spatiumScale = 1,
    } = {}) {
        let spatium = groundSize * spatiumScale, totalTime = 100 * timeScale;
        this.userData = {
            direction,
            spatium,
            totalTime,
            velocity: spatium / totalTime,
            timestamp: performance.now(),
            position: this.position.clone(),
        };
        this.moving = true;
    };
    update(timestamp) {
        let { moving } = this;
        if (!moving) return;
        let moveState = this.userData;
        let dt = timestamp - moveState.timestamp;
        if (dt >= moveState.totalTime) {
            moving = this.moving = false;
            dt = moveState.totalTime;
        }
        this.position.x = moveState.position.x + (moveState.velocity * dt) * moveState.direction.x;
        this.position.z = moveState.position.z + (moveState.velocity * dt) * moveState.direction.z;
        super.update(timestamp);
    };
    groundCollisionDetection() { return this.collisionDetection(CollisionBox.GROUND_LAYER); };
    hurtCollisionDetection() { return this.collisionDetection(CollisionBox.HURT_LAYER); };
    rewardCollisionDetection() { return this.collisionDetection(CollisionBox.REWARD_LAYER); };
    triggerCollisionDetection() { return this.collisionDetection(CollisionBox.TRIGGER_LAYER); };
};

export {
    PlayerEntity,
    PlayerEntity as default,
};
