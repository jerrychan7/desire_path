import { groundSize, groundFaceSize } from "./constants.js";
import { THREE, BufferGeometryUtils, d2r, TmpResManager } from "./utils.js";
import { GOModel, MeshModel } from "./Model.js";

let trm = new TmpResManager();

const vertChainsawMesh = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([...Array(7)].map((_, i) =>
        trm.add(new THREE.CylinderGeometry(groundFaceSize / 2, groundFaceSize / 2, 0.1, 3, 1, false, d2r(360 / 7 * i)))
    )),
    new THREE.MeshLambertMaterial({ color: 0xFF374F, })
);
const vertChainsawTrackMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(groundSize, 0.15),
    new THREE.MeshLambertMaterial({ color: 0x000000, opacity: 0.3, transparent: true, polygonOffset: true, polygonOffsetFactor: -1, })
);

trm.clear();
trm = null;

class VertChainsawMod extends GOModel {
    constructor(faceZ = false) {
        super();
        this.mod = vertChainsawMesh.clone();
        this.add(this.mod);
        if (faceZ) this.rotateZ(d2r(-90));
        else this.rotateX(d2r(-90));
        this.faceZ = faceZ;
        this.mod.onBeforeRender = () => {
            this.rotateY(d2r(-2));
        };
    };
    onBeforeCalcCollisionBox() {
        if (!super.onBeforeCalcCollisionBox()) return false;
        if (this.faceZ) this.rotation.z = d2r(-90);
        else this.rotation.x = d2r(-90);
        return true;
    };
};
class VertChainsawTrackMod extends MeshModel {
    constructor(faceZ = false) {
        super().copy(vertChainsawTrackMesh);
        if (faceZ) {
            this.rotateZ(d2r(-90));
            this.rotateY(d2r(-90));
        }
        else this.rotateX(d2r(-90));
    };
};

export {
    VertChainsawMod,
    VertChainsawTrackMod,
};
