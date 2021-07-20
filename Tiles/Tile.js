import { Entity } from "../Entities/Entity.js";
import { COLB_GROUND_LAYER, CollisionBox } from "../core/CollisionBox.js";

class Tile extends Entity {
    constructor(x, z, autoUpdateCollisionBox = false) {
        super(x, z, { autoUpdateCollisionBox });
        this.type = "Tile";
    };
    get collisionBox() { return super.collisionBox; };
    set collisionBox(box) {
        box.max.y -= 0.001;
        super.collisionBox = box;
    };
    setCollisionBox(mod = this, layers = [], {
        showBoxHelper,
        boxHelperColor = 0xff00ff,
    } = {}) {
        return super.setCollisionBox(mod, layers, { showBoxHelper, boxHelperColor, });
    };
    get groundCollisionBox() { return this._groundCollisionBox; };
    set groundCollisionBox(box) {
        box.max.y += 0.001;
        this._groundCollisionBox = box;
    };
    setGroundCollisionBox(mod = this, layers = [COLB_GROUND_LAYER], {
        showBoxHelper,
        boxHelperColor = 0x0000ff,
    } = {}) {
        this.disposeGroundCollisionBox();
        this.updateMatrixWorld();
        const cbox = this.groundCollisionBox = new CollisionBox(mod, layers, { showBoxHelper, boxHelperColor, });
        return cbox;
    };
    collisionBoxUpdate() {
        if (this.groundCollisionBox) {
            this.updateMatrixWorld();
            this.groundCollisionBox = this.groundCollisionBox.update();
        }
        super.collisionBoxUpdate();
    };
    disposeGroundCollisionBox() {
        this.groundCollisionBox && this.groundCollisionBox.dispose();
    };
    dispose() {
        if (this.disposed) return false;
        this.disposeGroundCollisionBox();
        super.dispose();
    };
    addEnts(...ents) {
        ents.forEach(ent => {
            ent.setPosition();
            ent.disposeCollisionBox();
        });
        return this.addMods(...ents);
    };
};

export {
    Tile,
    Tile as default,
};
