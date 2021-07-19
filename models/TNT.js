import fontJson from "./fontData.js";
import { tntSize, vertexColorsMat } from "./constants.js";
import { THREE, CSG, d2r, TmpResManager } from "./utils.js";
import { MeshModel } from "./Model.js";

let trm = new TmpResManager();

let textGeo = trm.add(new THREE.TextGeometry("TNT", {
    font: new THREE.Font(fontJson),
    size: tntSize / 3.5,
    height: tntSize,
    curveSegments: 1,
}));
textGeo.computeBoundingBox();
let getCenter = axis => -0.5 * (textGeo.boundingBox.max[axis] - textGeo.boundingBox.min[axis]);
textGeo.translate(getCenter("x"), getCenter("y"), getCenter("z"));
textGeo.rotateY(d2r(180));
const tntMesh = new THREE.Mesh(
    CSG.BufferGeometry(CSG.union([
        trm.add(new THREE.BoxGeometry(tntSize, tntSize, tntSize)),
        CSG.union([
            textGeo,
            trm.clone(textGeo).rotateY(d2r(90)),
            trm.add(new THREE.BoxGeometry(tntSize, tntSize / 3, tntSize)),
        ], [
            new THREE.Color(0x000000),
            new THREE.Color(0x000000),
            new THREE.Color(0xCECFD0),
        ]),
    ], [
        new THREE.Color(0xDC1015)
    ])),
    vertexColorsMat
);
tntMesh.translateY(tntSize / 2);

trm.clear();
trm = textGeo = getCenter = null;

class TNTMod extends MeshModel {
    static get tntSize() { return tntSize; };
    constructor() {
        super().copy(tntMesh);
        this.type = "TNTMod";
    };
};

export {
    TNTMod,
    TNTMod as default,
};
