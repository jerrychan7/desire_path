import Entity from "./Entity.js";
import { FortMod } from "../models/index.js";
import { COLB_HURT_LAYER } from "../core/CollisionBox.js";

const d2r = d => d * Math.PI / 180;

import BulletEntity from "./Bullet.js";

class FortEntity extends Entity {
    constructor(x, z, pathInit, {
        emitDirections = [FortEntity.DIR_NX],
        // s / emit
        batchInterval = [1, 1, 1, 1],
        batchRandomness = [0, 0, 0, 0],
        numOfStep = [1, 1, 1, 1],
        numOfStepRandomness = [0, 0, 0, 0],
        stepInterval = [0.2, 0.2, 0.2, 0.2],
        stepRandomness = [0, 0, 0, 0],
    } = {}) {
        super(x, z, pathInit);
        this.type = "FortEntity";
        let faceNX = emitDirections.some(v => v.equals(FortEntity.DIR_NX)),
            faceNZ = emitDirections.some(v => v.equals(FortEntity.DIR_NZ));
        let mod = new FortMod(faceNX && faceNZ? 2: faceNX || faceNZ? 1: 0);
        if (faceNZ && !faceNX) mod.rotateY(d2r(-90));
        this.addMods(mod);
        this.setCollisionBox(mod, [COLB_HURT_LAYER]);

        this.emitDirections = emitDirections;
        this.batchInterval = batchInterval.map(i => i * 1000);
        this.batchRandomness = batchRandomness;
        this.numOfStep = numOfStep;
        this.numOfStepRandomness = numOfStepRandomness;
        this.stepInterval = stepInterval.map(i => i * 1000);
        this.stepRandomness = stepRandomness;
        this.state = emitDirections.map(_ => ({
            stepCount: 0,
            lastTime: 0,
        }));
    };
    update(timestamp) {
        // return float [-len, len)
        const random = (len, randomness) => len * randomness * (Math.random() * 2 - 1);
        // return int (-len, 0]
        const random2 = (len, randomness) => -Math.floor(len * randomness * Math.random());
        this.state.forEach((state, i) => {
            let {stepCount, lastTime} = state;
            if (stepCount < this.numOfStep[i] + random2(this.numOfStep[i], this.numOfStepRandomness[i])) {
                if (stepCount === 0 || timestamp - lastTime >= this.stepInterval[i] + random(this.stepInterval[i], this.stepRandomness[i])) {
                    this.emit(this.emitDirections[i]);
                    state.lastTime = timestamp;
                    ++state.stepCount;
                }
            }
            else if (timestamp - lastTime >= this.batchInterval[i] + random(this.batchInterval[i], this.batchRandomness[i])) {
                state.stepCount = 0;
            }
        });
        super.update(timestamp);
    };
    emit(dir) {
        this.addToScene(new BulletEntity(this.initX, this.initZ, {
            direction: dir,
        }));
    };
};

export {
    FortEntity,
    FortEntity as default,
};
