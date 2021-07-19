// import * as THREE from "three";
import GameObj from "./GameObj.js";
import * as tiles from "../Tiles/index.js";
import * as entities from "../Entities/index.js";

const EMP = () => [0];
const GRD = () => [1];
const CST = () => [2];
const SWC = (type, targets) => [3, {}, type, targets];
const THO = () => [4];
const TRE = () => [5];
// thorn dir:
// 0 x-, 1 z-, 2 x+, 3, z+
// 射击批次: 批次间的间隔 间隔的随机程度(0-1越小越稳定)
// 批次内发射: 发射次数 次数的混乱程度 发射的间隔 间隔的混乱程度
const FRT = (dirs, batchInterval, batchRandomDegree, numOfStep, numOfStepRandomness, stepInterval, stepRandomDegree) =>
    [6, {}, dirs, batchInterval, batchRandomDegree, numOfStep, numOfStepRandomness, stepInterval, stepRandomDegree];
const ACC = (dir) => [7, dir];
const SAW = () => [8];
const LCT = () => [9];
const BCT = () => [10];

// 0 empty, 1 ground, 2 crystal, 3 switch, 4 thorn, 5 tree, 6 fort,
// 7 acceleration zone, 8 垂直电锯 chainsaw, 9 终点大水晶 huge crystal, 10 大水晶 big crystal,
// 11 tnt, 12 水平6角齿轮, 13 流星锤 Meteor, 14 upside thorn

// switch type:
// 0 thorn, 
// switch coordinate: x, z

const COL_YEL = 0xFDC88F;
const COL_RED = 0xDA667F;
const COL_PUR = 0xD198C4;
const COL_AQU = 0x1FAEB4;
const COLORS = [COL_YEL, COL_RED, COL_PUR, COL_AQU];

const WEA_CLEAR = 0, WEA_PARTLY_CLOUDY = 1, WEA_RAIN = 2;
const WEATHERS = [WEA_CLEAR, WEA_PARTLY_CLOUDY, WEA_RAIN];

const num_tile = {
    0: "EmptyTile",
    1: "GroundTile",
    2: "CrystalTile",
    3: "SwitchTile",
    4: "ThornTile",
    5: "TreeTile",
    6: "FortTile",
    7: "AccZoneTile",
    8: "VertChainsawTile",
    9: "HugeCrystalTile",
    10: "BigCrystalTile",
    11: "TNTTile",
    12: "HorizHexGearTile",
    13: "MeteorTile",
    14: "UpsideThornTile",
};

const units = {
    "favicon.ico": [{
        color: COL_RED,
        maps: [[[1]], [[5], [2]]],
    }],
    "tmp": [{
        entities: [{
            type: "",
            initPos: [2, 0, 7],
            pathPos: [],
            pathDuration: 10,
            pathInterval: 1,
        }, ],
        maps: [],
    }, ],
    "-1": [{
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [1], [1], [1], ],
            [[0], [0], [1], [1], [0], [1], ],
            [[0], [1], [1], [1], [4], [1], [1], ],
            [[0], [5], [0], [1], [0], [1], [0], [1], ],
            [[0], [1], [1], [1], [2], [2], [2], [1], ],
            [[0], [1], [0], [1], [4], [2], [1], [1], ],
            [[0], [1], [1], [0], [7], [0], [1], [1], ],
            [[0], [1], [0], [1], [1], [1], [1], ],
            [[0], [1], [0], [1], ],
            [[0], [5], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [1], [1], [1], ],
            [[0], [0], [0], [0], [7], [1], ],
            [[0], [1], [1], [0], [1], [1], [1], ],
            [[0], [1], [1], [0], [1], [4], [2], ],
            [[0], [0], [0], [1], [1], [2], ],
            [[0], [0], [0], [1], [2], [2], [1], [1], ],
            [[0], [5], [1], [1], [2], [2], [1], [1], ],
            [[0], [1], [1], [1], [2], [1], [1], ],
            [[0], [1], [1], [2], ],
            [[0], [1], [2], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [7], [1], [1], ],
            [[0], [0], [1], [1], [1], [1], ],
            [[0], [1], [2], [0], [1], [1], [12], ],
            [[0], [1], [2], [2], [0], [10], [1], [1], ],
            [[0], [2], [2], [2], [0], [0], [1], [12], ],
            [[0], [2], [2], [0], [0], [1], [1], ],
            [[0], [1], [1], [1], [0], [2], [1], [1], ],
            [[0], [1], [1], [1], [2], [1], [1], ],
            [[0], [1], [12], [2], ],
            [[0], [1], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [7], [1], [1], ],
            [[0], [0], [1], [1], [1], [1], ],
            [[0], [1], [2], [0], [1], [1], [12], ],
            [[0], [1], [2], [2], [0], [1], [1], [1], ],
            [[0], [2], [2], [2], [0], [0], [1], [12], ],
            [[0], [2], [2], [0], [0], [1], [1], ],
            [[0], [1], [1], [1], [0], [2], [1], [1], ],
            [[0], [1], [1], [1], [2], [1], [1], ],
            [[0], [1], [12], [2], ],
            [[0], [1], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [7], [1], [1], ],
            [[0], [0], [7], [1], [1], [1], ],
            [[0], [0], [7], [0], [0], [5], [5], ],
            [[0], [0], [1], [0], [1], [5], [5], [5], ],
            [[0], [1], [1], [0], [6, {}, [1]], [5], [5], [5], ],
            [[0], [2], [2], [0], [5], [5], [5], [5], ],
            [[0], [2], [2], [0], [5], [5], [5], [5], ],
            [[0], [2], [2], [0], [1], [1], [1], ],
            [[0], [2], [1], ],
            [[0], [1], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [1], [0], [1], ],
            [[0], [0], [7], [0], [1], [1], ],
            [[0], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [1], [1], ],
            [[0], [10], [1], [0], [0], [0], [2], [1], ],
            [[0], [1], [2], [0], [0], [0], [1], [1], ],
            [[0], [6, {}, [0], undefined, [0.3]], [6, {}, [0], undefined, [0.3]], [6, {}, [0], undefined, [0.3]], [0], [1], [0], [1], ],
            [[0], [0], [0], [0], [1], [1], [1], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [1], [0], [1], ],
            [[0], [0], [7], [0], [1], [1], ],
            [[0], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [1], [1], ],
            [[0], [1], [1], [0], [0], [0], [1], [1], ],
            [[0], [1], [1], [0], [0], [0], [1], [1], ],
            [[0], [6, {}, [0], undefined, [0.3]], [6, {}, [0], undefined, [0.3]], [6, {}, [0], undefined, [0.3]], [0], [1], [0], [1], ],
            [[0], [0], [0], [0], [1], [1], [1], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [2], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [1], [0], [1], ],
            [[0], [0], [7], [0], [1], [1], ],
            [[0], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [1], [1], ],
            [[0], [1], [2], [0], [0], [0], [1], [1], ],
            [[0], [1], [1], [0], [0], [0], [1], [1], ],
            [[0], [6, {}, [0], undefined, [0.3]], [6, {}, [0], undefined, [0.3]], [6, {}, [0], undefined, [0.3]], [0], [1], [0], [1], ],
            [[0], [0], [0], [0], [1], [1], [1], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [1], ],
            [[0], [0], [7], [1], [1], [1], ],
            [[0], [1], [2], [1], [1], [1], [1], ],
            [[0], [1], [2], [1], [8], [1], [0], [1], ],
            [[0], [2], [2], [2], [2], [1], [1], [1], ],
            [[0], [1], [1], [2], [1], [1], [1], [1], ],
            [[0], [1], [1], [2], [2], [2], [1], [1], ],
            [[0], [1], [1], [0], [2], [1], [1], ],
            [[0], [1], [1], [2], ],
            [[0], [4], [2], [1], ],
        ],
    }, {
        maps: [
            [[2], [2], [1], [1], ],
            [[0], [2], [2], [1], [1], ],
            [[1], [1], [2], [1], [1], [12], ],
            [[1], [1], [2], [0], [0], [1], [1], ],
            [[0], [1], [2], [3, {}, 0, 5, 6], [1], [1], [1], ],
            [[0], [1], [0], [1], [1], [4], ],
            [[0], [1], [1], [0], [7], ],
            [[0], [0], [0], [1], [1], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [2], [1], ],
        ],
    }, {
        entities: [{
            type: "VertChainsawEntity",
            initPos: [3, 0, 2],
            pathPos: [[3, 0, 2], [3, 0, 6]],
            pathDuration: 2666.66,
            faceZ: true,
        }, {
            type: "VertChainsawEntity",
            initPos: [8, 0, 5],
            pathPos: [[8, 0, 5], [5, 0, 5]],
            pathDuration: 2266.66,
        }, {
            type: "VertChainsawEntity",
            initPos: [7, 0, 7],
            pathPos: [[7, 0, 7], [7, 0, 10]],
            pathDuration: 2133.33,
            faceZ: true,
        }, ],
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [7], [1], [1], ],
            [[0], [0], [1], [2], [2], [2], ],
            [[0], [1], [1, {hasChainsawTrack: true, chainsawTrackFaceZ: true}], [1, {hasChainsawTrack: true, chainsawTrackFaceZ: true}], [1, {hasChainsawTrack: true, chainsawTrackFaceZ: true}], [1, {hasChainsawTrack: true, chainsawTrackFaceZ: true}], [1, {hasChainsawTrack: true, chainsawTrackFaceZ: true}], ],
            [[0], [1], [1], [1], [1], [0], [1], [1], ],
            [[0], [1], [0], [1], [1, {hasChainsawTrack: true}], [1], [1], [1], ],
            [[0], [1], [1], [1, {hasChainsawTrack: true}], [1], [0], [1], [1], ],
            [[0], [1], [1, {hasChainsawTrack: true}], [1], [1, {hasChainsawTrack: true, chainsawTrackFaceZ: true}], [1, {hasChainsawTrack: true, chainsawTrackFaceZ: true}], [1, {hasChainsawTrack: true, chainsawTrackFaceZ: true}], [1, {hasChainsawTrack: true, chainsawTrackFaceZ: true}], ],
            [[0], [1, {hasChainsawTrack: true}], [0], [1], [1], [1], [1], ],
            [[0], [1], [2], [2], ],
            [[0], [1], [2], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [1], [0], [1], ],
            [[0], [0], [1], [0], [1], [1], ],
            [[0], [1], [1], [7, [1], ], [7, [1], ], [7, [1], ], [2], ],
            [[0], [5], [0], [1], [1], [0], [2], [1], ],
            [[0], [0], [1], [1], [4], [2], ],
            [[0], [0], [0], [1], [2], [2], [1], [1], ],
            [[0], [0], [1], [0], [2], ],
            [[0], [1], [1], [2], [1], [1], [1], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [1], [2], [2], ],
            [[0], [0], [7], [0], [2], [2], ],
            [[0], [1], [1], [0], [0], [2], [2], ],
            [[0], [1], [1], [1], [0], [0], [2], [2], ],
            [[0], [1], [1], [0], [0], [0], [2], [2], ],
            [[0], [1], [1], [1], [0], [0], [2], [1], ],
            [[0], [1], [1], [1], [1], [1], [4], [5], ],
            [[0], [1], [4], [1], [1], [1], [1], ],
            [[0], [1], [2], [2], ],
            [[0], [2], [2], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], [6, {}, [2], [1.2], [0.1], [2], [1], [0.33], [0.5]], ],
            [[0], [1], [1], [1], [1], ],
            [[1], [1], [1], [1], [1], [6, {}, [1]], ],
            [[1], [1], [1], [0], [0], [1], [1], ],
            [[0], [0], [1], [3, {}, 0, 5, 6], [1], [1], [1], ],
            [[0], [1], [0], [1], [1], [4], ],
            [[0], [1], [6], [0], [7], ],
            [[0], [0], [0], [1], [1], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [2], [1], ],
        ],
    }, {
        entities: [{
            type: "HorizHexGearEntity",
            initPos: [5, 0, 11],
            pathPos: [[5, 0, 11], [5, 0, -2], [13, 0, 6], [-2, 0, 6], [13, 0, 6], [5, 0, -2]],
            pathDuration: 4000,
        }, ],
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [1], [2], [2], ],
            [[0], [0], [7], [0], [2], [2], ],
            [[0], [1], [1], [0], [0], [2], [2], ],
            [[0], [1], [1], [1], [0], [0], [2], [2], ],
            [[0], [1], [1], [0], [0], [0], [2], [2], ],
            [[0], [1], [1], [1], [0], [0], [2], [1], ],
            [[0], [1], [1], [1], [1], [1], [1], [5], ],
            [[0], [1], [1], [1], [1], [1], [1], ],
            [[0], [1], [2], [2], ],
            [[0], [2], [2], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [7], [0], [1], ],
            [[0], [0], [1], [1], [1], [1], ],
            [[0], [0], [13], [0], [1], [0], [1], ],
            [[0], [1], [1], [1], [2], [1], [1], [1], ],
            [[0], [1], [0], [13], [0], [1], [0], [1], ],
            [[0], [1], [1], [1], [2], [1], [13], [1], ],
            [[0], [1], [0], [1], [0], [1], [0], [1], ],
            [[0], [1], [1], [1], [2], [1], [1], ],
            [[0], [1], [0], [1], ],
            [[0], [1], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [7], [1], [6, {}, [1]], ],
            [[0], [0], [7], [1], [1], [6, {}, [1]], ],
            [[0], [0], [7], [1], [1], [1], [6, {}, [1]], ],
            [[0], [0], [1], [0], [1], [1], [1], [1], ],
            [[0], [1], [1], [0], [1], [1], [1], [1], ],
            [[0], [1], [1], [0], [1], [1], [1], [1], ],
            [[0], [1], [1], [0], [1], [1], [1], [6, {}, [1]], ],
            [[0], [1], [1], [0], [1], [1], [1], ],
            [[0], [1], [1], ],
            [[0], [1], [1], [1], ],
        ],
    }, {
        maps: [
            [[2], [2], [2], ],
            [[0], [0], [2], [0], [4], ],
            [[0], [0], [2], [0], [4], [4], ],
            [[0], [1], [2], [0], [4], [4], [4], ],
            [[0], [1], [2], [0], [0], [0], [4], [4], ],
            [[0], [2], [2], [2], [2], [0], [4], [4], ],
            [[0], [4], [4], [2], [0], [4], [4], [4], ],
            [[0], [0], [7], [0], [0], [0], [4], [5], ],
            [[0], [2], [2], [2], [4], [0], [4], ],
            [[0], [4], [2], [4], ],
            [[0], [2], [2], [1], ],
        ],
    }, {
        entities: [{
            type: "MeteorEntity",
            initPos: [4, 0, 1.5],
            pathPos: [[4, 0, 1.5], [4, 0, 6.5]],
            pathDuration: 5333.33,
            pathThetaStart: 533.33,
        }, {
            type: "MeteorEntity",
            initPos: [4, 0, 6.5],
            pathPos: [[4, 0, 6.5], [4, 0, 1.5]],
            pathDuration: 5333.33,
        }, ],
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [1], [1], [1], ],
            [[0], [0], [1], [1], [1], [1], ],
            [[0], [1], [1], [6, {}, [0, 1], ], [1], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [0], [1], ],
            [[0], [1], [1], [0], [7], [1], [1], [1], ],
            [[0], [1], [0], [7], [1], [1], [1], [1], ],
            [[0], [1], [2], [2], [1], [1], [1], ],
            [[0], [1], [2], [1], ],
            [[0], [2], [2], [1], ],
        ],
    }, {
        entities: [{
            type: "HorizHexGearEntity",
            initPos: [4, 0, 7],
            pathPos: [[4, 0, 7], [4, 0, 1]],
            pathDuration: 4400.33,
        }, {
            type: "HorizHexGearEntity",
            initPos: [1, 0, 4],
            pathPos: [[1, 0, 4], [7, 0, 4]],
            pathDuration: 4400,
        }],
        maps: [
            [[1], [1], [1], ],
            [[0], [0], [1], [1], [1], ],
            [[0], [0], [7], [0], [1], [1], ],
            [[0], [1], [1], [1], [1], [0], [1], ],
            [[0], [1], [1], [1], [0], [0], [0], [1], ],
            [[0], [1], [1], [1], [0], [5], [0], [1], ],
            [[0], [1], [1], [1], [0], [0], [0], [1], ],
            [[0], [1], [1], [1], [0], [1], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [1], ],
            [[0], [1], [1], [1], ],
            [[0], [1], [1], [1], ],
        ],
    }, ],
    0: [{
        maps: [
            [[1], [2], [2], [2], [2], ],
            [[1], [1], [1], [0], [2], ],
            [[1], [1], [1], [0], [2], [2], ],
            [[0], [2], [6, {}, [0], ], [1], [1], [3, {}, 0, 4, 5], ],
            [[0], [1], [0], [1], [0], [4], ],
            [[0], [0], [1], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], [10, { groundMovable: true, }], [1], ],
            [[2], [2], [1], [0], [2], ],
            [[1], [2], [1], [0], [2], [2], ],
            [[0], [2], [2], [2], [1], [3, {}, 0, 4, 5], ],
            [[0], [1], [0], [1], [0], [4], ],
            [[0], [0], [5], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], [1, { groundMovable: true, }], [2], ],
            [[1], [1], [1], [0], [2], ],
            [[1], [1], [6, {}, [1]], [0], [2], [2], ],
            [[0], [2], [2], [2], [1], [3, {}, 0, 4, 5], ],
            [[0], [1], [0], [1], [0], [4], ],
            [[0], [0], [1], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], [1, { groundMovable: true, }], [2], ],
            [[2], [2], [1], [0], [2], ],
            [[1], [2], [1], [0], [2], [2], ],
            [[0], [2], [2], [2], [1], [3, {}, 0, 4, 5], ],
            [[0], [1], [0], [1], [0], [4], ],
            [[0], [0], [5], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], [10, { groundMovable: true, }], [2], ],
            [[2], [2], [1], [0], [2], ],
            [[1], [2], [1], [0], [2], [2], ],
            [[0], [2], [2], [2], [1], [3, {}, 0, 4, 5], ],
            [[0], [1], [0], [1], [0], [4], ],
            [[0], [0], [5], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], ],
        ],
    }, {
        maps: [
            [[1], [1], [1], [10, { groundMovable: true, }], [2], ],
            [[1], [2], [1], [0], [2], ],
            [[1], [1], [2], [0], [2], [2], ],
            [[0], [0], [1], [2], [1], [3, {}, 0, 4, 5], ],
            [[0], [5], [0], [1], [0], [4], ],
            [[0], [0], [6], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], ],
        ],
    }, ],
    1: [{
        color: COL_RED,
        maps: [
            [[1], [1], [1], [1], [2], ],
            [[1], [2], [1], [2], [2], ],
            [[1], [1], [2], [1], [2], [2], ],
            [[0], [2], [1], [2], [1], [1], ],
            [[0], [5], [2], [1], [1], [1], ],
            [[0], [0], [1], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], [1], [1], [1], ],
            [[0], [0], [0], [0], [0], [1], [0], [1], ],
            [[0], [0], [0], [0], [7], [1], [1], [1], ],
            [[0], [0], [1], [2], [1], [1], [1], [1], ],
            [[0], [6], [2], [1], [8], [1], [0], [1], ],
            [[0], [2], [2], [2], [1], [1], [1], [1], ],
            [[0], [6], [1], [2], [1], [1], [1], [1], ],
            [[0], [1], [1], [2], [2], [2], [1], [6, {}, [1], ], ],
            [[0], [1], [1], [0], [2], [1], [1], ],
            [[0], [1], [1], [2], ],
            [[0], [4], [2], [1], [9], ]
        ],
    }, ],
    2: [{
        color: COL_PUR,
        entities: [{
            type: "TNTEntity",
            initPos: [3, 0, 2],
            pathPos: [[3, 0, 2], [3, 0, 4]],
            pathDuration: 1300,
        }, {
            type: "HorizHexGearEntity",
            initPos: [20, 0, 13],
            pathPos: [[20, 0, 13], [7, 0, 13], [20, 0, 13], ],
            pathDuration: 4000,
            pathInterval: 3000,
            showShadow: false,
        }, {
            type: "HorizHexGearEntity",
            initPos: [12, 0, 6],
            pathPos: [[12, 0, 6], [12, 0, 20], [12, 0, 6]],
            pathDuration: 5000,
            pathInterval: 2000,
            showShadow: false,
        }, ],
        maps: [
            [[1], [1], [1], [1], [1], ],
            [[2], [2], [1], [0], [1], ],
            [[1], [2], [1], [0], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], ],
            [[0], [1], [0], [2], [0], [1], ],
            [[0], [0], [0], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], [1], [1], [1], [6, {}, [2], undefined, undefined, [3], [0], undefined, [1]], ],
            [[0], [0], [0], [0], [1], [1], [1], [1], ],
            [[0], [0], [1], [1], [1], [1], [1], [6, {}, [1], undefined, [0.5], ], ],
            [[0], [1], [1], [1], [0], [0], [6, {}, [1], undefined, [0.5], ], [1], ],
            [[0], [0], [1], [3, {}, 0, 12, 13], [1], [1], [1], ],
            [[0], [1], [0], [1], [1], [4], ],
            [[0], [1], [6], [0], [7], ],
            [[0], [0], [0], [1], [1], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [2], [1], [9], ],
        ],
    }, ],
    3: [{
        color: COL_AQU,
        weather: WEA_PARTLY_CLOUDY,
        temperature: -1,
        entities: [{
            type: "TNTEntity",
            initPos: [8, 0, 10],
            pathPos: [[8, 0, 10], [13, 0, 10]],
            pathDuration: 3400,
            pathThetaStart: 600,
        }, {
            type: "TNTEntity",
            initPos: [10, 0, 8],
            pathPos: [[10, 0, 8], [10, 0, 13]],
            pathDuration: 3400,
        }, {
            type: "TNTEntity",
            initPos: [14, 0, 11],
            pathPos: [[14, 0, 11], [14, 0, 14]],
            pathDuration: 2133,
            pathThetaStart: 266,
        }, {
            type: "TNTEntity",
            initPos: [12, 0, 12],
            pathPos: [[12, 0, 12], [12, 0, 15]],
            pathDuration: 2266,
        }, ],
        maps: [
            [[1], [2], [2], [2], [2], ],
            [[1], [1], [1], [1], [2], ],
            [[1], [1], [1], [0], [2], [2], ],
            [[0], [1], [1], [1], [1], [1], ],
            [[0], [6], [0], [1], [0], [1], ],
            [[0], [0], [6], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], [1], [1], [1], ],
            [[0], [0], [0], [0], [0], [7], [1], [1], ],
            [[0], [0], [0], [0], [1], [1], [1], [1], ],
            [[0], [0], [1], [1], [1], [1], [1], [1], ],
            [[0], [1], [1], [1], [2], [2], ],
            [[0], [1], [1], [0], [1], [1], [1], [1], ],
            [[0], [1], [0], [1], [1], [1], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [0], [6, {}, [1], ], ],
            [[0], [6, {}, [0], [1.8]], [0], [0], [1], [1], ],
            [[0], [0], [1], [1], ],
            [[0], [0], [1], [1], [9], ],
        ],
    }, ],
    4: [{
        color: COL_YEL,
        maps: [
            [[1], [12], [1], [0], [2], ],
            [[1], [1], [1], [2], [6, {}, [1], [2], ], ],
            [[1], [1], [6, {}, [1], ], [1], [2], [2], ],
            [[0], [2], [2], [0], [1], [1], ],
            [[0], [1], [0], [1], [0], [1], ],
            [[0], [0], [1], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], [1], [1], [1], ],
            [[0], [0], [0], [0], [0], [7], [1], [1], ],
            [[0], [0], [0], [0], [7], [1], [1], [6, {}, [1], [1.6], ], ],
            [[0], [0], [0], [7], [1], [1], [5], [5], ],
            [[0], [0], [1], [0], [6, {}, [1], [1.6], ], [5], [5], [5], ],
            [[0], [1], [1], [0], [6, {}, [1], [1.6], ], [5], [5], [5], ],
            [[0], [2], [2], [0], [5], [5], [5], [5], ],
            [[0], [2], [2], [0], [5], [5], [5], [5], ],
            [[0], [2], [2], [0], [1], [1], [6, {}, [1], ], ],
            [[0], [2], [1], ],
            [[0], [1], [1], [1], [9], ],
        ],
    }, ],
    5: [{
        color: COL_RED,
        entities: [{
            type: "HorizHexGearEntity",
            initPos: [2, 0, 8],
            pathPos: [[2, 0, 8], [2, 0, -4], [8, 0, 0], [2, 0, 8], [8, 0, 0], [2, 0, -4]],
            pathDuration: 5600,
            showShadow: false,
        }, {
            type: "HorizHexGearEntity",
            initPos: [11, 0, 8.5],
            pathPos: [[11, 0, 8.5], [12.5, 0, 9.5], [12, 0, 10.5], [10.5, 0, 9]],
            pathDuration: 2266.66,
            showShadow: false,
            scale: 0.5,
        }, {
            type: "HorizHexGearEntity",
            initPos: [12.5 ,0, 15.5],
            pathPos: [[12.5 ,0, 15.5], [13, 0, 14.5], [14, 0, 15.5], [14, 0, 16.5]],
            pathDuration: 2266.66,
            showShadow: false,
            scale: 0.5,
        }, {
            type: "HorizHexGearEntity",
            initPos: [16 ,0, 15.5],
            pathPos: [[16 ,0, 15.5], [14.5, 0, 14.5], [15, 0, 13.5], [16.5, 0, 14.5]],
            pathDuration: 2333.33,
            showShadow: false,
            scale: 0.5,
        }],
        maps: [
            [[1], [1], [1], [1], [2], ],
            [[1], [2], [1], [2], [2], ],
            [[1], [1], [2], [1], [2], [2], ],
            [[0], [2], [1], [2], [1], [1], ],
            [[0], [5], [2], [1], [1], [1], ],
            [[0], [0], [1], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], [1], [1], [1], ],
            [[0], [0], [0], [0], [0], [1], [2], [2], ],
            [[0], [0], [0], [0], [7], [0], [2], [2], ],
            [[0], [0], [1], [1], [0], [0], [2], [2], ],
            [[0], [1], [1], [1], [0], [0], [2], [2], ],
            [[0], [1], [1], [0], [0], [0], [2], [2], ],
            [[0], [1], [1], [1], [0], [0], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [1], [6, {}, [1], ], ],
            [[0], [1], [1], [1], [1], [1], [6, {}, [1], ], ],
            [[0], [1], [1], [1], ],
            [[0], [1], [1], [1], [9], ],
        ],
    }, ],
    6: [{
        color: COL_RED,
        entities: [{
            type: "MeteorEntity",
            initPos: [3, 0, 3],
            pathPos: [[3, 0, 3], [1, 0, 3], [1, 0, 1], [3, 0, 1], [3, 0, 3], [3, 0, 1], [1, 0, 1], [1, 0, 3]],
            pathDuration: 4800,
            pathTension: 0.5,
        }, {
            type: "MeteorEntity",
            initPos: [4, 0, 5],
            pathPos: [[4, 0, 5], [2, 0, 5], [2, 0, 3], [4, 0, 3], [4, 0, 4], [4, 0, 3], [2, 0, 3], [2, 0, 5]],
            pathDuration: 6133.33,
            pathTension: 0.5,
        }, {
            type: "MeteorEntity",
            initPos: [11, 0, 8.5],
            pathPos: [[11, 0, 8.5], [11, 0, 13.5]],
            pathDuration: 5333.33,
            pathThetaStart: 533.33,
        }, {
            type: "MeteorEntity",
            initPos: [11, 0, 13.5],
            pathPos: [[11, 0, 13.5], [11, 0, 8.5]],
            pathDuration: 5333.33,
        }, ],
        maps: [
            [[1], [1], [1], [1], [2], ],
            [[1], [1], [1], [1], [2], ],
            [[1], [1], [2], [1], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], ],
            [[0], [5], [2], [1], [1], [1], ],
            [[0], [0], [1], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], [1], [1], [1], ],
            [[0], [0], [0], [0], [0], [1], [1], [1], ],
            [[0], [0], [0], [0], [1], [1], [1], [1], ],
            [[0], [0], [1], [1], [6, {}, [0, 1], ], [1], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [0], [1], ],
            [[0], [1], [1], [0], [7], [1], [1], [1], ],
            [[0], [1], [0], [7], [6, {}, [0, 1], ], [1], [1], [1], ],
            [[0], [1], [2], [2], [1], [1], [1], ],
            [[0], [1], [2], [1], ],
            [[0], [2], [2], [1], [1], [1], [1], ],
            [[0], [0], [0], [0], [0], [3, {}, 1, 19, 18], [1], [1], ],
            [[0], [0], [0], [3, {}, 1, 18, 19], [2], [2], [2], [1], ],
            [[0], [1], [1], [1], [1], [2], [2], ],
            [[5], [1], [2], [1], [1], [2], [1], [2], ],
            [[0], [2], [2], [2], [1], [2], [2], [2], ],
            [[0], [0], [2], [2], [1], [1], [2], [6, {}, [1], ], ],
            [[0], [1], [2], [2], [0], [2], [6, {}, [1], ], ],
            [[0], [1], [2], [1], [2], [1], [1], ],
            [[0], [2], [2], [1], ],
            [[0], [1], [2], [1], [9], ]
        ],
    }, ],
    7: [{
        color: COL_PUR,
        entities: [{
            type: "MeteorEntity",
            initPos: [21, 0, 19],
            pathPos: [[21, 0, 19], [21, 0, 23.5]],
            pathDuration: 4800,
        }, {
            type: "MeteorEntity",
            initPos: [23, 0, 20],
            pathPos: [[23, 0, 20], [23, 0, 25.5]],
            pathDuration: 5866.66,
            pathThetaStart: 866.66,
        }, {
            type: "MeteorEntity",
            initPos: [24, 0, 21],
            pathPos: [[24, 0, 21], [24, 0, 26.5]],
            pathDuration: 5866.66,
        }, ],
        maps: [
            [[1], [1], [1], [1], [1], ],
            [[2], [2], [6, {}, [0, 1], ], [0], [1], ],
            [[1], [2], [1], [0], [1], [1], ],
            [[0], [2], [1], [1], [1], [1], ],
            [[0], [1], [0], [6], [0], [1], ],
            [[0], [0], [0], [0], [7], ],
            [[0], [0], [0], [1], ],
            [[0], [0], [1], [1], [1], [1], [1], ],
            [[0], [0], [0], [0], [0], [1], [1], [14], ],
            [[0], [0], [0], [0], [0], [0], [7], ],
            [[0], [0], [0], [0], [0], [1], ],
            [[0], [0], [0], [0], [14], [1], [14], ],
            [[0], [0], [0], [0], [0], [14, {}, 0.5], ],
            [[0], [0], [0], [0], [14, {}, 0.5 / 3 * 2], [0], [0], [5], ],
            [[0], [0], [0], [14, {}, 0.5 / 3], [0], [0], [1], [6, {}, [1], ], ],
            [[0], [0], [1], ],
            [[0], [2], [2], [2], ],
            [[0], [0], [1], [1], [1], [1], [1], ],
            [[0], [0], [0], [0], [0], [7], [1], [1], ],
            [[0], [0], [0], [0], [1], [1], [1], [1], ],
            [[0], [0], [1], [1], [4], [1], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [1], [1], ],
            [[0], [1], [1], [1], [0], [1], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [1], [1], ],
            [[0], [1], [1], [1], [1], [1], [1], [1], ],
            [[0], [1], [1], [2], [1], [1], [1], ],
            [[0], [2], [2], [2], ],
            [[0], [6], [2], [1], [9], ]
        ],
    }, ],
};

class MapUnit extends GameObj {
    static coordKey({x = 0, y = 0, z = 0} = {}) { return x + "," + z; };
    static coordDekey(key) { key = key.split(","); return [Number(key[0]), 0, Number(key[1])]; };
    constructor(level = 0, offsetX = 0, offsetZ = 0) {
        super();
        this.type = "MapUnit";
        this.level = level;
        this.offsetX = offsetX; this.offsetZ = offsetZ;
        this.tiles = {}; this.entities = [];
        this.switchMap = {};
        this.subLevel = ~~(Math.random() * units[level].length);
        // this.subLevel = level >= 0? 1: 18;
        units[level][this.subLevel]?.maps?.forEach((row, x) => {
            row.forEach((tile, z) => {
                if (x >= 5) z += x - 4;
                this.setTileByID(tile[0], x, z, ...tile);
            });
        });
        units[level][this.subLevel]?.entities?.forEach(ent => {
            this.setEntityByType(ent.type, ent.initPos[0], ent.initPos[2], ent);
        });
        let [xs, zs] = Object.keys(this.tiles).reduce((ans, key) => {
            key = MapUnit.coordDekey(key);
            ans[0].push(key[0]);
            ans[1].push(key[2]);
            return ans;
        }, [[], []]);
        this.minX = Math.min(...xs); this.maxX = Math.max(...xs);
        this.minZ = Math.min(...zs); this.maxZ = Math.max(...zs);
        this.sizeX = this.maxX - this.minX + 1;
        this.sizeZ = this.maxZ - this.minZ + 1;
        this.color = units[level][0].color || COLORS[~~(Math.random() * COLORS.length)];
        this.weather = units[level][0].weather;
        this.temperature = units[level][0].temperature || 0;
    };
    getTile(x, z) { return this.tiles[MapUnit.coordKey({x, z})]; };
    setTileByID(id, x, z, ...initArgs) { return this.setTileByType(num_tile[id], x, z, ...initArgs); };
    setTileByType(type, x, z, ...initArgs) {
        const Tile = tiles[type], tileX = x + this.offsetX, tileZ = z + this.offsetZ;
        let tile = null;
        if (type == "SwitchTile") {
            tile = new Tile(tileX, tileZ, initArgs[1], initArgs[2]);
            let key = MapUnit.coordKey({x, z});
            if (initArgs[2] == 1 && this.switchMap[key]) {
                let targetSwitch = this.switchMap[key];
                targetSwitch.setTargetTile(tile);
                tile.setTargetTile(targetSwitch);
                delete this.switchMap[key];
            }
            else {
                this.switchMap[initArgs[3] + "," + initArgs[4]] = tile;
            }
            // console.log(x, z, initArgs[3] + "," + initArgs[4]);
        }
        else if (type == "FortTile") {
            tile = new Tile(tileX, tileZ, initArgs[1], {
                ...(initArgs[2]? {emitDirections: initArgs[2].map(dir => [
                    Tile.DIR_NX,
                    Tile.DIR_NZ,
                    Tile.DIR_PX,
                    Tile.DIR_PZ,
                ][dir])}: {}),
                batchInterval: initArgs[3],
                batchRandomness: initArgs[4],
                numOfStep: initArgs[5],
                numOfStepRandomness: initArgs[6],
                stepInterval: initArgs[7],
                stepRandomness: initArgs[8],
            });
            // console.log(x, z);
        }
        else if (type == "ThornTile") {
            tile = new Tile(tileX, tileZ, initArgs[1], initArgs[2]);
            this.switchMap[x + "," + z]?.setTargetTile(tile);
            delete this.switchMap[x + "," + z];
            // console.log(x + "," + z);
        }
        else if (type == "AccZoneTile") {
            tile = new Tile(tileX, tileZ, { direction: [
                tiles.AccZoneTile.DIR_PX,
                tiles.AccZoneTile.DIR_PZ,
                tiles.AccZoneTile.DIR_NX,
                tiles.AccZoneTile.DIR_NZ,
            ][initArgs[1] || 0], });
        }
        else if (type == "UpsideThornTile") {
            tile = new Tile(tileX, tileZ, initArgs[1], {
                thetaStart: initArgs[2],
                fallingSpeed: initArgs[3],
            });
        }
        else if (Tile) tile = new Tile(tileX, tileZ, initArgs[1]);
        if (tile === null) return false;
        this.tiles[MapUnit.coordKey({x, z})] = tile;
        this.needBeDispose.push(tile);
        this.add(tile);
    };
    setEntityByType(type, x, z, initArgs) {
        const Entity = entities[type], entX = x + this.offsetX, entZ = z + this.offsetZ;
        let ent = null;
        if (type == "HorizHexGearEntity") {
            ent = new Entity(entX, entZ, initArgs, initArgs.showShadow, initArgs.scale);
        }
        else if (type == "VertChainsawEntity") {
            ent = new Entity(entX, entZ, initArgs, initArgs.faceZ);
        }
        else if (Entity) ent = new Entity(entX, entZ, initArgs);
        if (ent === null) return false;
        if (type != "BulletEntity") {
            this.entities.push(ent);
            this.needBeDispose.push(ent);
        }
        this.add(ent);
    };
};

class GameMap extends THREE.Group {
    constructor(level = 0, { playerPos = null } = {}) {
        super();
        this.type = "GameMap";
        this.level = level;
        this.offset = 0;
        this.units = [];
        if (level <= 0) {
            this.pushUnit();
            this.backgroundColor = COLORS[~~(Math.random() * COLORS.length)];
            this.weather = WEATHERS[~~(Math.random() * WEATHERS.length)];
            this.temperature = Math.random() * 100 - 50;
        }
        else {
            let unit = this.pushUnit(level);
            this.backgroundColor = unit.color;
            this.weather = unit.weather;
            this.temperature = unit.temperature;
        }
        if (playerPos != null) this.update(playerPos);
    };
    getUnitByTileXZ(x, z) {
        return this.units.find(({offsetX, offsetZ, sizeX, sizeZ, level}) => {
            let mx = offsetX + sizeX - 1, mz = offsetZ + sizeZ - (level < 0);
            return x <= mx && z < mz && offsetX <= x && offsetZ <= z;
        }) || null;
    };
    pushUnit(level, offset = this.offset) {
        let unit = new MapUnit(level, offset, offset);
        this.units.push(unit);
        this.offset += Math.max(unit.sizeX - 1, unit.sizeZ - 1);
        this.add(unit);
        return unit;
    };
    shiftUnit() {
        let unit = this.units.shift();
        unit.dispose();
    };
    getTile(x, z) {
        return this.getUnitByTileXZ(x, z)?.getTile(x, z) || null;
    };
    update(playerPos) {
        if (this.level > 0) return;
        let nowUnit = this.getUnitByTileXZ(Math.round(playerPos.x), Math.round(playerPos.z));
        if (nowUnit === this.units[this.units.length - 1]) {
            this.pushUnit(-1);
        }
        if (this.units.length >= 4) {
            this.shiftUnit();
        }
        return nowUnit;
    };
    dispose() {};
};


export {
    MapUnit,
    GameMap,
};
