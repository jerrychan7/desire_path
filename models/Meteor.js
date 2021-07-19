import { unitLen, vertexColorsMat } from "./constants.js";
import { THREE, BufferGeometryUtils, d2r, TmpResManager, geoWithColor } from "./utils.js";
import { GOModel } from "./Model.js";

let trm = new TmpResManager();

const meteorMesh = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([
        geoWithColor(new THREE.SphereGeometry(unitLen * 0.7), 0x911243, {trm}),
        geoWithColor(new THREE.ConeGeometry(unitLen * 0.4, 0.5, 4, 1, false, d2r(45)).translate(0, 0.6, 0), 0xe91e63, {trm}),
        geoWithColor(new THREE.ConeGeometry(unitLen * 0.4, 0.5, 4, 1, false, d2r(45)).rotateX(d2r(-180)).translate(0, -0.6, 0), 0xe91e63, {trm}),
        geoWithColor(new THREE.ConeGeometry(unitLen * 0.4, 0.5, 4, 1, false).rotateX(d2r(-90)).translate(0, 0, -0.6).rotateY(d2r(45)), 0xe91e63, {trm}),
        geoWithColor(new THREE.ConeGeometry(unitLen * 0.4, 0.5, 4, 1, false).rotateX(d2r(-90)).translate(0, 0, -0.6).rotateY(d2r(-45)), 0xe91e63, {trm}),
        geoWithColor(new THREE.ConeGeometry(unitLen * 0.4, 0.5, 4, 1, false).rotateX(d2r(-90)).translate(0, 0, -0.6).rotateY(d2r(135)), 0xe91e63, {trm}),
        geoWithColor(new THREE.ConeGeometry(unitLen * 0.4, 0.5, 4, 1, false).rotateX(d2r(-90)).translate(0, 0, -0.6).rotateY(d2r(-135)), 0xe91e63, {trm}),
    ]),
    vertexColorsMat
);
meteorMesh.rotateOnAxis(new THREE.Vector3(Math.SQRT1_2, 0, -Math.SQRT1_2), Math.atan(Math.SQRT1_2));
meteorMesh.position.y = 1.3;
const meteorShadowMod = new THREE.Mesh(
    new THREE.CircleGeometry(0.25),
    new THREE.MeshLambertMaterial({ color: 0x000000, opacity: 0.3, polygonOffset: true, polygonOffsetFactor: -1, transparent: true, })
);
meteorShadowMod.rotateX(d2r(-90));

trm.clear();
trm = null;

class MeteorMod extends GOModel {
    constructor() {
        super();
        this.type = "MeteorMod";
        let mod = this.meteor = meteorMesh.clone(),
            shadow = this.shadow = meteorShadowMod.clone();
        this.add(mod, shadow);
        mod.onBeforeRender = () => {
            mod.rotateY(d2r(2));
        };
        this.calcCollisionBoxObj = mod;
    };
    onBeforeCalcCollisionBox() {
        // console.log("MeteorMod onBeforeCalcCollisionBox")
        return super.onBeforeCalcCollisionBox();
    };
};

export {
    MeteorMod,
    MeteorMod as default,
};
