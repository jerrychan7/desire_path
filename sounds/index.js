// import * as THREE from "three";
import { audioListener, audioLoader } from "../core/threeApp.js";

let mute = (localStorage.getItem("mute") == "true") || false;

const bgms = ["bgm", "birdsong", "rainAndThunder", "wind", "worm", ];
let notLoadBgms = true;

const filenames = [
    "accZone", "bgm", "bigCrystal", "birdsong", "btnClick",
    "challengesSuccess", "crystal", "die", "move", "rainAndThunder",
    "score+1", "switch", "switch2", "wind", "worm"
];

const sounds = {
    "&all": []
};
const soundsPromise = {};

function getMute() { return mute; };
function setMute(tureOrFalse) {
    mute = tureOrFalse;
    localStorage.setItem("mute", mute);
    Object.entries(sounds).forEach(([filename, sound]) => {
        if (filename === "&all" || (sound.isPlaying === false && sound.loop === false)) return;
        if (mute) sound.stop();
        else sound.play();
    });
}

class Sound extends THREE.Audio {
    constructor() {
        super(audioListener);
    };
    clone() { return super.clone().setBuffer(this.buffer); };
    play() {
        if (!mute) {
            super.play();
            this.isPlaying = this.loop;
        }
        return this;
    };
};

const defaultSound = new Sound();

notLoadBgms = !confirm("Do you want to load background music (BGM) with a size of about 2.5MB?");

soundsPromise["&all"] = Promise.all(filenames.map(filename => {
    sounds[filename] = defaultSound;
    if (bgms.includes(filename) && notLoadBgms)
        return soundsPromise[filename] = Promise.resolve(sounds[filename]);
    const url = `./sounds/${filename}.mp3`;
    return soundsPromise[filename] = new Promise((res, rej) => {
        audioLoader.load(url, res, () => {}, rej);
    }).then(buffer => {
        const sound = sounds[filename] = new Sound();
        sound.setBuffer(buffer);
        sounds["&all"].push(sound);
        return sound;
    }, e => {
        console.error(e);
        return null;
    });
}));

soundsPromise["bgm"].then(sound => {
    sound.setLoop(true);
});

window.addEventListener("load", () => {
    soundsPromise["btnClick"].then(sound => {
        [...document.querySelectorAll('[class*="-btn"], #page-challenges .levels > *')].forEach(btn => {
            btn.addEventListener("click", e => {
                sound.play();
            });
        });
    });
});

export {
    sounds,
    sounds as default,
    soundsPromise,
    Sound,
    getMute, setMute,
};
