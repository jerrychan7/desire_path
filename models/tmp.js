// import * as THREE from "three";
import CSG from "three-csg";
import { unitLen, vertexColorsMat, } from "./constants.js";
import { d2r, geoWithColor, TmpResManager, } from "./utils.js";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { GOModel, MeshModel } from "./Model.js";

let trm = new TmpResManager();



trm.clear();
trm = null;



export {
    ASDF,
    ASDF as default,
};
