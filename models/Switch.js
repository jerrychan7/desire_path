import { THREE, CSG, BufferGeometryUtils, d2r, geoWithColor, TmpResManager, } from "./utils.js";
import { GOModel } from "./Model.js";

let trm = new TmpResManager();

const switchGeo = CSG.BufferGeometry(CSG.union([
    trm.add(new THREE.BoxGeometry(0.7, 0.4, 0.7)),
    trm.add(new THREE.BoxGeometry(0.4, 0.4, 0.4)),
], [new THREE.Color(0xdddddd), new THREE.Color(0x00ff00)]));
const switchMat = new THREE.MeshLambertMaterial({
    polygonOffset: true,
    polygonOffsetFactor: -1,
    vertexColors: THREE.FaceColors,
});
const switchPlaneMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.4, 0.4),
    new THREE.MeshLambertMaterial({ color: 0xb02734, polygonOffset: true, polygonOffsetFactor: -3, })
);
const switchActiveColor = new THREE.Color(0xbbbbbb);
const switchInactiveColor = new THREE.Color(0xffffff);
switchPlaneMesh.rotateX(d2r(-90));

// switch2
const switch2Geo = geoWithColor(new THREE.BoxGeometry(0.7, 0.4, 0.7), 0xdddddd, {trm, addResultToTrm: false});
const switch2PlaneMesh = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([
        geoWithColor(new THREE.PlaneGeometry(0.2, 0.2).rotateX(d2r(-90)).translate(0.1, 0.2, -0.1), 0x7BDF7C, {trm}),
        geoWithColor(new THREE.PlaneGeometry(0.2, 0.2).rotateX(d2r(-90)).translate(-0.1, 0.2, 0.1), 0x7BDF7C, {trm}),
        geoWithColor(new THREE.PlaneGeometry(0.2, 0.2).rotateX(d2r(-90)).translate(-0.1, 0.2, -0.1), 0x539698, {trm}),
        geoWithColor(new THREE.PlaneGeometry(0.2, 0.2).rotateX(d2r(-90)).translate(0.1, 0.2, 0.1), 0x539698, {trm}),
    ]),
    new THREE.MeshLambertMaterial({
        polygonOffset: true,
        polygonOffsetFactor: -3,
        vertexColors: THREE.FaceColors,
    })
);

trm.clear();
trm = null;

class SwitchMod extends GOModel {
    constructor(activation = false) {
        super();
        this.type = "SwitchMod";
        const mat = this.switchMat = switchMat.clone();
        const switchMesh = this.switchMesh = new THREE.Mesh(switchGeo, mat);
        this.addNeedBeDispose(mat);
        this.add(switchMesh, switchPlaneMesh.clone());
        this.activity(activation);
    };
    activity(trueOrFalse) {
        this.activation = trueOrFalse;
        this.switchMesh.position.y = trueOrFalse? -0.2: 0;
        this.switchMat.color = trueOrFalse? switchActiveColor: switchInactiveColor;
        return this;
    };
};

class Switch2Mod extends GOModel {
    constructor(activation = false) {
        super();
        this.type = "Switch2Mod";
        const mat = this.switchMat = switchMat.clone();
        this.addNeedBeDispose(mat);
        const switchMesh = this.switchMesh = new THREE.Mesh(switch2Geo, mat);
        const switchFace = this.face = switch2PlaneMesh.clone();
        this.add(switchMesh, switchPlaneMesh.clone(), switchFace);
        this.activity(activation);

        let i = performance.now();
        switchFace.onBeforeRender = () => {
            let t = performance.now();
            if (t - i >= 200) {
                switchFace.rotateY(d2r(90));
                i = t;
            }
        };
    };
    activity(trueOrFalse) {
        this.activation = trueOrFalse;
        this.switchMesh.position.y = trueOrFalse? -0.2: 0;
        this.switchMat.color = trueOrFalse? switchActiveColor: switchInactiveColor;
        if (trueOrFalse) this.face.removeFromParent();
        else if (this.face.parent != this) this.add(this.face);
        // this.face.visible = !trueOrFalse;
        return this;
    };
};

export {
    SwitchMod,
    Switch2Mod,
};
