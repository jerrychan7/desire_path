import { unitLen, crystalHeight, heightOffGroundOfCrystal } from "./constants.js";
import { THREE, BufferGeometryUtils, d2r, TmpResManager, } from "./utils.js";
import { GOModel, MeshModel } from "./Model.js";

let trm = new TmpResManager();

const blueCrystalMat = new THREE.MeshPhongMaterial({ color: 0x03a9f4, flatShading: true, transparent: true, opacity: 0.8, shininess: 1024, });
const purpleCrystalMat = new THREE.MeshPhongMaterial({ color: 0xCA52B7, flatShading: true, transparent: true, opacity: 0.8, shininess: 1024, });

const crystalGeo = BufferGeometryUtils.mergeBufferGeometries([
    trm.add(new THREE.ConeGeometry(unitLen * 0.4, crystalHeight / 2, 4, 1, true, d2r(135)).translate(0, heightOffGroundOfCrystal + crystalHeight / 2 + crystalHeight / 4, 0)),
    trm.add(new THREE.ConeGeometry(unitLen * 0.4, crystalHeight / 2, 4, 1, true, d2r(45)).rotateX(d2r(180)).translate(0, heightOffGroundOfCrystal + crystalHeight / 4, 0)),
]);
const crystalShadowMesh = new THREE.Mesh(
    new THREE.CircleGeometry(0.1),
    new THREE.MeshLambertMaterial({ color: 0x000000, opacity: 0.3, polygonOffset: true, polygonOffsetFactor: -1, transparent: true, })
);
crystalShadowMesh.rotateX(d2r(-90));

trm.clear();
trm = null;

class CrystalModBase extends GOModel {
    static get crystalHeight() { return crystalHeight };
    static get heightOffGround() { return heightOffGroundOfCrystal; };
    constructor() {
        super();
        this.type = "CrystalModBase";
        this.shadow = crystalShadowMesh.clone();
        this.add(this.shadow);
    };
    get crystal() { return this._crystal; };
    set crystal(mesh) {
        this._crystal = mesh;
        let i = Math.floor(360 * Math.random()),
            rotateVel = d2r(1.2 + 0.5 * (Math.sin(i) + 1) / 2);
        mesh.onBeforeRender = () => {
            this.crystal.rotateY(rotateVel);
            let d = Math.sin(d2r(i += 6));
            this.crystal.position.y = 0.1 * d;
            this.shadow.scale.x = this.shadow.scale.y = (d - 1.5) / 2;
        };
        this.add(mesh);
        this.calcCollisionBoxObj = mesh;
    };
};

class CrystalMod extends CrystalModBase {
    constructor() {
        super();
        this.type = "CrystalMod";
        this.crystal = new THREE.Mesh(crystalGeo, blueCrystalMat);
    };
};
class BigCrystalMod extends CrystalModBase {
    static get crystalHeight() { return super.crystalHeight * 1.2; };
    static get heightOffGround() { return super.heightOffGround * 1.2; };
    constructor() {
        super();
        this.type = "BigCrystalMod";
        this.crystal = new THREE.Mesh(crystalGeo, purpleCrystalMat);
        this.scale.set(1.2, 1.2, 1.2);
    };
};
class HugeCrystalMod extends CrystalModBase {
    static get crystalHeight() { return super.crystalHeight * 1.5; };
    static get heightOffGround() { return super.heightOffGround * 1.5; };
    constructor() {
        super();
        this.type = "HugeCrystalMod";
        this.crystal = new THREE.Mesh(crystalGeo, purpleCrystalMat);
        this.scale.set(1.5, 1.5, 1.5);
    };
};

export {
    blueCrystalMat,
    purpleCrystalMat,
    CrystalMod,
    BigCrystalMod,
    HugeCrystalMod,
};
