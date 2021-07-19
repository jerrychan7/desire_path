import { groundFaceSize, vertexColorsMat, thornSize, thornHeight } from "./constants.js";
import { THREE, BufferGeometryUtils, d2r, geoWithColor, TmpResManager, } from "./utils.js";
import { GOModel } from "./Model.js";
import { thornsGeo } from "./Thorn.js";

let trm = new TmpResManager();

const upsideThornMesh = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([
        geoWithColor(thornsGeo, 0xFC3D29, {trm, addGeoToTrm: false}).rotateZ(d2r(180)),
        geoWithColor(new THREE.BoxGeometry(0.5 * 2 + thornSize, 0.5, 0.5 * 2 + thornSize).translate(0, 0.5 / 2 + thornHeight / 2, 0), 0x539698, {trm}),
    ]).translate(0, thornHeight / 2, 0),
    vertexColorsMat
);
upsideThornMesh.scale.set(0.9, 0.9, 0.9);
const upsideThornShadowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(groundFaceSize * 0.55, groundFaceSize * 0.55),
    new THREE.MeshLambertMaterial({ color: 0x000000, opacity: 0.3, polygonOffset: true, polygonOffsetFactor: -1, transparent: true, })
);
upsideThornShadowMesh.rotateX(d2r(-90));

trm.clear();
trm = null;

class UpsideThornMod extends GOModel {
    constructor() {
        super();
        this.type = "UpsideThornMod";
        this.thorn = upsideThornMesh.clone();
        this.shadow = upsideThornShadowMesh.clone();
        this.add(this.thorn, this.shadow);
        this.scale.set(0.8, 0.8, 0.8);
        this.calcCollisionBoxObj = this.thorn;
    };
    setGroundClearance(d) {
        this.thorn.position.y = d;
        this.shadow.scale.set(1 + d * 0.3, 1 + d * 0.3, 1 + d * 0.3);
    };
};

export {
    UpsideThornMod,
    UpsideThornMod as default,
};
