// import * as THREE from "three";
import { scene } from "./threeApp.js";

const gameObjs = [];

class GameObj extends THREE.Group{
    static updateAll(timestamp) {
        gameObjs.forEach(obj => obj.update(timestamp));
    };
    static disposeAll() {
        while (gameObjs.length)
            gameObjs[0].dispose();
    };
    constructor() {
        super();
        this.needBeDispose = [];
        this.type = "GameObj";
        gameObjs.push(this);
        this.disposed = false;
        this.lastUpdateTimestamp = 0;
    };
    addNeedBeDispose(obj) {
        this.needBeDispose.push(obj);
        return this;
    };
    dispose() {
        if (this.disposed) return false;
        this.disposed = true;
        this.removeFromParent();
        this.needBeDispose.forEach(obj => obj.dispose());
        gameObjs.splice(gameObjs.indexOf(this), 1);
        return true;
    };
    update(timestamp) {
        this.lastUpdateTimestamp = timestamp;
    };
    addToScene(obj) {
        scene.add(obj);
        return this;
    };
};

window.gameObjs = gameObjs;


export {
    GameObj,
    GameObj as default,
};
