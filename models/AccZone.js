import { groundFaceSize, groundSize, groundHeight, vertexColorsMat, } from "./constants.js";
import { THREE, CSG, d2r, TmpResManager, } from "./utils.js";
import { MeshModel } from "./Model.js";

let trm = new TmpResManager();

const accZoneMesh = new THREE.Mesh(
    CSG.BufferGeometry(CSG.union([
        CSG.union([
            trm.add(new THREE.BoxGeometry(groundSize * 0.3, groundHeight, groundSize * 0.23).translate(-groundSize * 0.3 / 2, 0, 0)),
            CSG.subtract([
                trm.add(new THREE.BoxGeometry(groundSize * 0.5, groundHeight, groundSize * 0.5).rotateY(d2r(45))),
                trm.add(new THREE.BoxGeometry(groundSize, groundHeight, groundSize).translate(-groundSize / 2, 0, 0)),
            ]),
        ]),
        trm.add(new THREE.BoxGeometry(groundFaceSize, groundHeight, groundFaceSize)),
        trm.add(new THREE.BoxGeometry(groundSize, groundHeight, groundSize)),
    ], [
        new THREE.Color(0xCFF0F7),
        new THREE.Color(0x74D4EA),
        new THREE.Color(0x85EFFF),
    ])),
    vertexColorsMat
);
accZoneMesh.translateY(-groundHeight / 2);

trm.clear();
trm = null;

class AccZoneMod extends MeshModel {
    constructor() {
        super().copy(accZoneMesh);
        this.type = "AccZoneMod";
    };
};

export {
    AccZoneMod,
    AccZoneMod as default,
};
