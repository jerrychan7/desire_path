import { THREE } from "./utils.js";

const unitLen = Math.SQRT2 / 2;
const thornSize = 0.6, thornHeight = 0.8, thornPedestalHeight = 0.2;
const groundSize = 2, groundFaceSize = groundSize * 0.85, groundHeight = 1.1;
const playerSize = 0.8, tntSize = playerSize;
const fortHeight = 1.3;
const crystalHeight = 0.6 * 2, heightOffGroundOfCrystal = 0.2;
const clipSize = groundFaceSize * 0.7, clipHight = 0.35;

const vertexColorsMat = new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors, });
const vertexColorsPhongMat = new THREE.MeshPhongMaterial({ vertexColors: THREE.FaceColors, flatShading: true, });

const candidatePlayerColor = [
    [0xA8A8A8, 0xDFDFDF, 0xA8A8A8],
    [0xff9bd7, 0xffffff, 0xff9bd7],
    [0xD694ED, 0xB89DE5, 0xA6B0E5],
    [0x41DC3E, 0x924745, 0x41DC3E],
    [0xEDB394, 0xE5A79D, 0xE5A6CB],
    [0xD56560, 0xDFDFDF, 0xD86661],
    [0xEF9214, 0xDFDFDF, 0x503592],
    [0xAB60D5, 0xDFDFDF, 0xAE61D8],
    [0xEF2C14, 0xDFDFDF, 0x58575E],
    [0xDC6027, 0x356292, 0xDC6027],
    [0x53BDDC, 0xBA8549, 0x53BDDC],
    [0xEDAA3E, 0xE58C4A, 0xE55A53],
    [0xDCA07A, 0x6D7992, 0xDCA07A],
    [0xDC7EA6, 0x709277, 0xDC7EA6],
    [0x6278ED, 0x6CB7E5, 0x75E5A3],
    [0x8114EF, 0xDFDFDF, 0x4F9235],
    [0xDCCC3E, 0x744592, 0xDCCC3E],
    [0xDC457E, 0x4A9260, 0xDC457E],
    [0x5FEF14, 0xDFDFDF, 0x924035],
    [0x323231, 0xDB6ADD, 0xC13E67],
    [0x14CBEF, 0xDFDFDF, 0x927635],
    [0xEEC995, 0xE6B99E, 0xE6A7A7],
    [0xF39F65, 0x4A5892, 0xF39F65],
    [0x78FFEC, 0xDFDFDF, 0x78FFEC],
    [0xFFBE11, 0xF4DCBB, 0x7815A7],
    [0x144AEF, 0xDFDFDF, 0x928635],
    [0xB8EE95, 0xDBE69E, 0xE6D8A7],
    [0x545454, 0x6ADDAA, 0x3E99C1],
    [0xFF5C4D, 0xDFDFDF, 0x356292],
    [0xCB78FF, 0xDFDFDF, 0xCB78FF],
];

export {
    unitLen,
    thornSize, thornHeight, thornPedestalHeight,
    groundSize, groundFaceSize, groundHeight,
    playerSize, tntSize,
    fortHeight,
    crystalHeight, heightOffGroundOfCrystal,
    clipSize, clipHight,
    vertexColorsMat, vertexColorsPhongMat,
    candidatePlayerColor,
};
