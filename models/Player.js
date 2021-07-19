import { THREE, CSG } from "./utils.js";
import { playerSize, vertexColorsMat, candidatePlayerColor } from "./constants.js";
import { MeshModel } from "./Model.js";

const playerGeos = [
    new THREE.BoxGeometry(playerSize, playerSize / 3, playerSize).translate(0, playerSize / 6 + playerSize / 3 * 2, 0),
    new THREE.BoxGeometry(playerSize, playerSize / 3, playerSize).translate(0, playerSize / 6 + playerSize / 3, 0),
    new THREE.BoxGeometry(playerSize, playerSize / 3, playerSize).translate(0, playerSize / 6, 0),
];

export class PlayerMod extends MeshModel {
    static get playerSize() { return playerSize; };
    constructor(colors = localStorage.getItem("currentPlayerColor") || 0) {
        if (!Array.isArray(colors))
            colors = candidatePlayerColor[colors] || candidatePlayerColor[0];
        colors = colors.map(c => new THREE.Color(c));
        super(
            CSG.BufferGeometry(CSG.union(playerGeos, colors)),
            vertexColorsMat
        );
        this.type = "PlayerMod";
        this.colors = colors;
        playerGeos.forEach(geo => geo.dispose());
    };
    dispose() {
        this.geometry.dispose();
    };
};
