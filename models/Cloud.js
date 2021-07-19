import { THREE, CSG, d2r, TmpResManager, } from "./utils.js";
import { MeshModel } from "./Model.js";

let trm = new TmpResManager();

const cloudMesh = new THREE.Mesh(
    CSG.BufferGeometry(CSG.subtract([
        trm.add(new THREE.BoxGeometry(5, 0.35, 6.5)),
        trm.add(new THREE.BoxGeometry(1, 0.35, 2).translate(5 / 2, 0, -6.5 / 2)),
        trm.add(new THREE.BoxGeometry(1.5, 0.35, 3).translate(-5 / 2, 0, -6.5 / 2)),
        trm.add(new THREE.BoxGeometry(3, 0.35, 3).translate(-5 / 2, 0, -6.5 / 2)),
        trm.add(new THREE.BoxGeometry(4, 0.35, 2).translate(-5 / 2, 0, 6.5 / 2)),
        trm.add(new THREE.BoxGeometry(2, 0.35, 6).translate(-5 / 2, 0, 6.5 / 2)),
    ])),
    new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
    })
).translateY(4);

trm.clear();
trm = null;

class CloudMod extends MeshModel {
    constructor() {
        super().copy(cloudMesh);
        this.rotateY(d2r(90 * ~~(Math.random() * 4)));
    };
};

export {
    CloudMod,
    CloudMod as default,
};
