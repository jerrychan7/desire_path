import { thornSize, thornHeight, thornPedestalHeight, unitLen } from "./constants.js";
import { THREE, BufferGeometryUtils, TmpResManager, d2r } from "./utils.js";
import { GOModel, MeshModel } from "./Model.js";

let trm = new TmpResManager();

const singleThornLevelPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const thornPedestalMat = new THREE.MeshLambertMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -1,
});
let singleThornPedestalGeo = trm.add(new THREE.BoxGeometry(thornSize, thornPedestalHeight, thornSize));
let singleThornGeo = new THREE.ConeGeometry(unitLen * thornSize, thornHeight, 4, 1, true, d2r(45));

const thornsGeo = BufferGeometryUtils.mergeBufferGeometries([
    trm.clone(singleThornGeo).translate(0.5, 0, 0.5),
    trm.clone(singleThornGeo).translate(-0.5, 0, 0.5),
    trm.clone(singleThornGeo).translate(0.5, 0, -0.5),
    trm.clone(singleThornGeo).translate(-0.5, 0, -0.5)
]);
const thornsMesh = new THREE.Mesh(thornsGeo, new THREE.MeshPhongMaterial({ color: 0xe91e63, flatShading: true, }));
const pedestalsGeo = BufferGeometryUtils.mergeBufferGeometries([
    trm.clone(singleThornPedestalGeo).translate(0.5, 0, 0.5),
    trm.clone(singleThornPedestalGeo).translate(-0.5, 0, 0.5),
    trm.clone(singleThornPedestalGeo).translate(0.5, 0, -0.5),
    trm.clone(singleThornPedestalGeo).translate(-0.5, 0, -0.5)
]);

trm.clear();
trm = singleThornPedestalGeo = singleThornGeo = null;

class ThornMod extends GOModel {
    static get thornSize() { return thornSize; };
    static get thornHeight() { return thornHeight; };
    static get pedestalHeight() { return thornPedestalHeight; };
    static get exposedHeight() { return 0.03; };
    constructor(activation = true) {
        super();
        this.type = "ThornMod";
        const thorns = this.thorns = thornsMesh.clone();
        const plane = this.plane = singleThornLevelPlane.clone();
        const pedestalMat = thornPedestalMat.clone();
        pedestalMat.clippingPlanes = [plane];
        const pedestalsMesh = new THREE.Mesh(pedestalsGeo, pedestalMat);
        pedestalsMesh.position.y = thornPedestalHeight / 2;
        this.add(thorns, pedestalsMesh);
        this.translateY(ThornMod.exposedHeight - thornPedestalHeight);
        this.activity(activation);
        this.addNeedBeDispose(pedestalMat);
    };
    activity(trueOrFalse) {
        this.activation = trueOrFalse;
        this.thorns.position.y = trueOrFalse? thornHeight / 2: -thornHeight / 2 + thornPedestalHeight - ThornMod.exposedHeight;
        this.plane.normal.y = trueOrFalse? 1: -1;
        return this;
    };
};

export {
    thornsGeo,
    ThornMod,
    ThornMod as default,
};
