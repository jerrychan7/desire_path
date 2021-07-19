import { THREE, CSG, TmpResManager } from "./utils.js";
import { groundSize, groundHeight, groundFaceSize, thornSize, vertexColorsMat } from "./constants.js";
import { MeshModel } from "./Model.js";

let trm = new TmpResManager();

let groundCSG = CSG.union([
    trm.add(new THREE.BoxGeometry(groundSize, groundHeight, groundSize)),
    trm.add(new THREE.BoxGeometry(groundFaceSize, groundHeight, groundFaceSize)),
], [
    new THREE.Color(0xFAE1A1),
    new THREE.Color(0xE5D8A2),
]);
const groundWithHollowsGeo = (() => {
    let hollow = trm.add(new THREE.BoxGeometry(thornSize, groundHeight + 1, thornSize));
    return CSG.BufferGeometry(CSG.subtract([
        groundCSG,
        trm.clone(hollow).translate(0.5, 0, 0.5),
        trm.clone(hollow).translate(-0.5, 0, 0.5),
        trm.clone(hollow).translate(0.5, 0, -0.5),
        trm.clone(hollow).translate(-0.5, 0, -0.5)
    ]));
})();
const groundMesh = new THREE.Mesh(
    CSG.BufferGeometry(groundCSG),
    vertexColorsMat
);
const groundWithHollowsMesh = new THREE.Mesh(
    groundWithHollowsGeo,
    new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide, })
);
groundMesh.translateY(-groundHeight / 2);
groundWithHollowsMesh.translateY(-groundHeight / 2);
// groundMesh.castShadow = false;
// groundMesh.receiveShadow = true;
// groundWithHollowsMesh.castShadow = false;
// groundWithHollowsMesh.receiveShadow = true;

trm.clear();
trm = groundCSG = null;

export class GroundMod extends MeshModel {
    static get groundSize() { return groundSize; };
    static get faceSize() { return groundFaceSize; };
    static get groundHeight() { return groundHeight; };
    constructor(hasThorn = false) {
        super().copy(hasThorn? groundWithHollowsMesh: groundMesh);
        this.type = "GroundMod";
    };
    dispose() {};
};
