import { unitLen, vertexColorsPhongMat, } from "./constants.js";
import { THREE, BufferGeometryUtils, d2r, geoWithColor, TmpResManager, } from "./utils.js";
import { GOModel } from "./Model.js";

let trm = new TmpResManager();

const shadowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.75, 0.75),
    new THREE.MeshLambertMaterial({ color: 0x000000, opacity: 0.3, polygonOffset: true, polygonOffsetFactor: -1, transparent: true, })
);
shadowMesh.rotateX(d2r(-90));
const treeWithWhiteTopMesh = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([
        geoWithColor(new THREE.PlaneGeometry(0.5, 0.5).rotateX(d2r(-90)).translate(0, 1.75, 0), 0xffffff, {trm}),
        geoWithColor(new THREE.CylinderGeometry(unitLen * 0.5, unitLen, 0.5, 4, 1, true, d2r(45)).translate(0, 1.5, 0), 0x5be052, {trm}),
        geoWithColor(new THREE.CylinderGeometry(unitLen, unitLen * 0.75, 0.5, 4, 1, true, d2r(45)).translate(0, 1, 0), 0x5be052, {trm}),
        geoWithColor(new THREE.BoxGeometry(0.25, 1, 0.25).translate(0, 0.5, 0), 0x9e946c, {trm}),
    ]),
    vertexColorsPhongMat
);
const treeWithGreenTopMesh = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([
        geoWithColor(new THREE.PlaneGeometry(0.5, 0.5).rotateX(d2r(-90)).translate(0, 1.75, 0), 0x5be052, {trm}),
        geoWithColor(new THREE.CylinderGeometry(unitLen * 0.5, unitLen, 0.5, 4, 1, true, d2r(45)).translate(0, 1.5, 0), 0x5be052, {trm}),
        geoWithColor(new THREE.CylinderGeometry(unitLen, unitLen * 0.75, 0.5, 4, 1, true, d2r(45)).translate(0, 1, 0), 0x5be052, {trm}),
        geoWithColor(new THREE.BoxGeometry(0.25, 1, 0.25).translate(0, 0.5, 0), 0x9e946c, {trm}),
    ]),
    vertexColorsPhongMat
);

trm.clear();
trm = null;

class TreeMod extends GOModel {
    constructor(whiteTop = false) {
        super();
        this.add(
            shadowMesh.clone(),
            (whiteTop? treeWithWhiteTopMesh: treeWithGreenTopMesh).clone(),
        );
        this.type = "TreeMod";
    };
};

export {
    TreeMod,
    TreeMod as default,
};
