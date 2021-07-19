// import * as THREE from "three";
const THREE = window.THREE;
import CSG from "./three-csg.min.js";
// import { BufferGeometryUtils } from "../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js";
const BufferGeometryUtils = THREE.BufferGeometryUtils;

class TmpResManager {
    constructor() {
        this.pool = [];
    };
    add(geo) {
        this.pool.push(geo);
        return geo;
    };
    clone(geo) {
        return this.add(geo.clone());
    };
    clear() {
        this.pool.forEach(geo => geo.dispose());
        this.pool = [];
    };
};

const d2r = THREE.MathUtils.degToRad;
const geoWithColor = (geo, color = null, {trm = null, addResultToTrm = true, addGeoToTrm = true} = {}) => {
    let buf = CSG.BufferGeometry(CSG.union([geo], [new THREE.Color(color)]));
    if (trm) {
        if (addGeoToTrm) trm.add(geo);
        if (addResultToTrm) trm.add(buf);
    }
    return buf;
};


export {
    THREE,
    CSG, BufferGeometryUtils,
    TmpResManager,
    d2r,
    geoWithColor,
};
