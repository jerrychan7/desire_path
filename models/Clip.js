import { vertexColorsMat, clipSize, clipHight } from "./constants.js";
import { THREE, CSG, d2r, TmpResManager, } from "./utils.js";
import { GOModel } from "./Model.js";

let trm = new TmpResManager();

const clipSize2 = clipSize / 2;
const leftClipMesh = new THREE.Mesh(
    CSG.BufferGeometry(CSG.union([
        CSG.intersect([
            trm.add(new THREE.BoxGeometry(clipSize, 1, clipSize * 2)),
            CSG.union([
                trm.add(new THREE.BoxGeometry(clipSize2 / Math.SQRT2, clipHight, clipSize2 / Math.SQRT2).rotateY(d2r(45)).translate(clipSize2, 0, clipSize2)),
                trm.add(new THREE.BoxGeometry(clipSize2 / Math.SQRT2, clipHight, clipSize2 / Math.SQRT2).rotateY(d2r(45)).translate(0, 0, clipSize2)),
                trm.add(new THREE.BoxGeometry(clipSize2 / Math.SQRT2, clipHight, clipSize2 / Math.SQRT2).rotateY(d2r(45)).translate(-clipSize2, 0, clipSize2)),
            ])
        ]),
        trm.add(new THREE.BoxGeometry(clipSize, clipHight, clipSize)),
    ], [
        new THREE.Color(0xe91e63),
        new THREE.Color(0x539698),
    ])),
    vertexColorsMat
);
const rightClipMesh = new THREE.Mesh(
    CSG.BufferGeometry(CSG.union([
        trm.add(new THREE.BoxGeometry(clipSize, clipHight, clipSize)),
        trm.add(new THREE.BoxGeometry(clipSize2 / Math.SQRT2, clipHight, clipSize2 / Math.SQRT2).rotateY(d2r(45)).translate(clipSize2 / 2, 0, -clipSize2)),
        trm.add(new THREE.BoxGeometry(clipSize2 / Math.SQRT2, clipHight, clipSize2 / Math.SQRT2).rotateY(d2r(45)).translate(-clipSize2 / 2, 0, -clipSize2)),
    ], [
        new THREE.Color(0x539698),
        new THREE.Color(0xe91e63),
        new THREE.Color(0xe91e63),
    ])),
    vertexColorsMat
);
leftClipMesh.translateY(clipHight / 2);
rightClipMesh.translateY(clipHight / 2);

trm.clear();
trm = null;

class ClipMod extends GOModel {
    constructor() {
        super();
        this.type = "ClipMod";
        let left = this.left = leftClipMesh.clone();
        let right = this.right = rightClipMesh.clone();
        this.add(left, right);
        // this.rotateY(d2r(90));
        // let i = 0;
        // left.onBeforeRender = () => {
        //     let d = Math.abs(Math.sin(d2r(i++))) * (groundSize / 2 + clipSize2 / 4);
        //     right.position.z = d + clipSize2 + clipSize2 / 4;
        //     left.position.z = -d - clipSize2 - clipSize2 / 4;
        // };
    };
};

export {
    ClipMod,
    ClipMod as default,
};
