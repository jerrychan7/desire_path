import { unitLen } from "./constants.js";
import { THREE, CSG, d2r, TmpResManager } from "./utils.js";
import { GOModel } from "./Model.js";

let trm = new TmpResManager();

const horizHexGearMesh = new THREE.Mesh(
    CSG.BufferGeometry(CSG.union([
        trm.add(new THREE.CylinderGeometry(unitLen * 1, unitLen * 1, 0.15, 3, 1)),
        trm.add(new THREE.CylinderGeometry(unitLen * 1, unitLen * 1, 0.15, 3, 1, false, d2r(60))),
    ])),
    new THREE.MeshLambertMaterial({ color: 0xff0000, })
);
horizHexGearMesh.translateY(0.15 / 2 + 0.15);
// horizHexGearMesh.castShadow = true;
// horizHexGearMesh.receiveShadow = true;
const horizHexGearShadowMesh = new THREE.Mesh(
    CSG.BufferGeometry(CSG.union([
        trm.add(new THREE.CylinderGeometry(unitLen * 1, unitLen * 1, 0.15, 3, 1)),
        trm.add(new THREE.CylinderGeometry(unitLen * 1, unitLen * 1, 0.15, 3, 1, false, d2r(60))),
    ])),
    new THREE.MeshLambertMaterial({ color: 0x000000, opacity: 0.3, transparent: true, })
);
horizHexGearShadowMesh.translateY(0.15 / 2);

trm.clear();
trm = null;

class HorizHexGearMod extends GOModel {
    constructor(showShadow = false) {
        super();
        this.type = "HorizHexGearMod";
        this.gear = horizHexGearMesh.clone();
        this.add(this.gear);
        if (showShadow) {
            this.shadow = horizHexGearShadowMesh.clone();
            this.add(this.shadow);
        }
        this.gear.onBeforeRender = () => {
            this.rotateY(d2r(-4));
        };
    };
};

export {
    HorizHexGearMod,
    HorizHexGearMod as default,
};
