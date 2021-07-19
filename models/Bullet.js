import { THREE } from "./utils.js";
import { MeshModel } from "./Model.js";

const bulletMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.2, 0.2).translate((-0.5 - 0.7) / 2, 1.3 / 2 - 0.1, 0),
    new THREE.MeshLambertMaterial({ color: 0xe91e63, })
);

class BulletMod extends MeshModel {
    constructor() {
        super().copy(bulletMesh);
        this.type = "BulletMod";
    };
};

export {
    BulletMod,
    BulletMod as default,
};
