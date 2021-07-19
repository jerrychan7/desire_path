import { fortHeight, vertexColorsMat, } from "./constants.js";
import { THREE, CSG, d2r, TmpResManager, } from "./utils.js";
import { MeshModel } from "./Model.js";

let trm = new TmpResManager();

let fortBaseCSG = CSG.union([
    trm.add(new THREE.BoxGeometry(0.7, fortHeight, 0.7)),
    trm.add(new THREE.BoxGeometry(0.5, fortHeight, 0.5)),
], [
    new THREE.Color(0xC58C9D),
    new THREE.Color(0x7BDF7C),
]);
const oneSideFortGeo = CSG.BufferGeometry(
    CSG.subtract([
        fortBaseCSG,
        trm.add(new THREE.BoxGeometry(0.7, 0.4, 0.4).translate(0, -0.1, 0)),
    ], [
        null,
        new THREE.Color(0xC58C9D),
    ])
);
const oneSideFortMesh = new THREE.Mesh(oneSideFortGeo, vertexColorsMat);
oneSideFortMesh.position.y = fortHeight / 2;
const twoSideFortMesh = new THREE.Mesh(
    CSG.BufferGeometry(CSG.subtract([
        fortBaseCSG,
        trm.add(new THREE.BoxGeometry(0.7 - (0.7 - 0.4) / 2, 0.4, 0.4).translate(-(0.7 - 0.4) / 2, -0.1, 0)),
        trm.add(new THREE.BoxGeometry(0.7 - (0.7 - 0.4) / 2, 0.4, 0.4).translate(-(0.7 - 0.4) / 2, -0.1, 0).rotateY(d2r(-90))),
    ], [
        null,
        new THREE.Color(0xC58C9D),
        new THREE.Color(0xC58C9D),
    ])),
    vertexColorsMat
);
twoSideFortMesh.position.y = fortHeight / 2;
const fortBaseMesh = new THREE.Mesh(CSG.BufferGeometry(fortBaseCSG), vertexColorsMat);
fortBaseMesh.position.y = fortHeight / 2;

trm.clear();
trm = fortBaseCSG = null;

class FortMod extends MeshModel {
    static get fortHeight() { return fortHeight; };
    constructor(type = 1) {
        super().copy([fortBaseMesh, oneSideFortMesh, twoSideFortMesh][type]);
        this.type = "FortMod";
    };
};

export {
    FortMod,
    FortMod as default,
};
