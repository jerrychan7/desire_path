
import game from "./Game.js";
import { rendererInit } from "./threeApp.js";
import { soundsPromise, getMute, setMute } from "../sounds/index.js";
import * as pcr from "./playerColorRender.js";
import * as favicon from "./favicon.js";

let sUserAgent = navigator.userAgent.toLowerCase();
window.isTouchDevice = [
    "android", "ucweb",
    "iphone os", "ipad", "ipod",
    "windows phone os", "windows ce", "windows mobile",
    "midp", "symbianos", "blackberry", "hpwos", "rv:1.2.3.4",
].some(s => sUserAgent.includes(s));

// const hasClass = (ele, cls) => ele && ele.className.includes(cls.trim());
// const addClass = (ele, cls) => hasClass(ele, cls)? ""
//     : ele.className = (ele.className? ele.className + " " + cls: cls).trim();
// const removeClass = (ele, cls) => !hasClass(ele, cls)? ""
//     : ele.className = ` ${ele.className} `.replace(/\s+/gi, " ").replace(` ${cls} `, " ").trim();
const sleep = ms => new Promise(res => setTimeout(res, ms));

const history = [ null, null, null, ];
class Page {
    constructor(id, fadeIn = true) {
        this.domElement = document.getElementById(id);
        this.listeners = {};
        this.fadeIn = fadeIn;
    };
    addEventListener(type, listener) {
        this.listeners[type] = this.listeners[type] || [];
        if (!this.listeners[type].includes(listener))
            this.listeners[type].push(listener);
    };
    dispatchEvent(type, msg) {
        this.listeners[type] && this.listeners[type].forEach(fn => fn(msg));
    };
    async show(msg) {
        this.dispatchEvent("onbeforeshow", msg);
        if (this.fadeIn) {
            this.domElement.style.transition = "none";
            this.domElement.style.opacity = 0;
            await sleep(0);
            this.domElement.style.transition = "";
            this.domElement.style.opacity = 1;
        }
        this.domElement.style.display = "";
        history.push(this);
        history.shift();
        this.dispatchEvent("onshown", msg);
    };
    hide(msg) {
        this.domElement.style.display = "none";
        this.dispatchEvent("onhided", msg);
    };
    isHided() { return this.domElement.style.display === "none"; };
    isShown() { return this.domElement.style.display !== "none"; };
};

let loading = null;
let welcome = null;
let setting = null;
let challenges = null;
let playing = null;
let gameover = null;
let challengesSuccess = null;


function init() {
    loading = new Page("page-loading");
    welcome = new Page("page-welcome");
    setting = new Page("page-setting");
    challenges = new Page("page-challenges");
    playing = new Page("page-playing", false);
    gameover = new Page("page-gameover");
    challengesSuccess = new Page("page-challenges-success");

    welcome.settingBtn = welcome.domElement.getElementsByClassName("setting-icon-btn")[0];
    welcome.levelsModeBtn = welcome.domElement.getElementsByClassName("levels-mode-btn")[0];
    welcome.playBtn = welcome.domElement.getElementsByClassName("play-icon-btn")[0];

    setting.musicBtn = document.getElementById("music-btn");
    setting.backBtn = setting.domElement.getElementsByClassName("back-icon-btn")[0];
    // if (getMute()) addClass(setting.musicBtn, "muted-music-icon-btn");
    if (getMute()) setting.musicBtn.classList.add("muted-music-icon-btn");

    challenges.backBtn = challenges.domElement.getElementsByClassName("back-icon-btn")[0];
    challenges.levels = challenges.domElement.getElementsByClassName("levels")[0];

    playing.gameCanvas = document.getElementById("game-canvas");
    playing.gameCover = welcome.domElement.getElementsByClassName("game-cover")[0];
    playing.operationDiscription = document.getElementById("operation-discription");
    playing.nowScoreBox = document.getElementById("nowScoreBox");
    playing.nowScore = document.getElementById("nowScore");
    playing.coverColor = "transparent";

    gameover.backBtn = gameover.domElement.getElementsByClassName("back-icon-btn")[0];
    gameover.info = gameover.domElement.getElementsByClassName("info")[0];
    gameover.playerColorSelect = gameover.domElement.getElementsByClassName("player-color-select")[0];
    gameover.playerColorOptions = gameover.domElement.getElementsByClassName("player-color-options")[0];
    gameover.crystalInfo = gameover.domElement.getElementsByClassName("crystal-info")[0];
    gameover.currentCrystalCount = document.getElementById("currentCrystalCount");
    gameover.crystalSpend = document.getElementById("crystalSpend");
    gameover.replayBtn = gameover.domElement.getElementsByClassName("replay-icon-btn")[0];
    gameover.playerColorOptionTemplate = document.getElementById("player-color-option-template");
    gameover.createPlayerColorOption = () => {
        const option = document.createElement("div");
        option.innerHTML = gameover.playerColorOptionTemplate.innerHTML;
        option.canvas = option.getElementsByTagName("canvas")[0];
        option.lockIcon = option.getElementsByClassName("lock-icon")[0];
        option.lockIcon.animation = lottie.loadAnimation({
            container: option.lockIcon,
            renderer: "svg",
            loop: false,
            autoplay: false,
            // https://icons8.com/icon/PefGoNzjlwmR/lock
            animationData: {"v":"5.4.4","fr":24,"ip":0,"op":28,"w":24,"h":24,"nm":"lock","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Top","parent":2,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[12,12,0],"ix":2},"a":{"a":0,"k":[12,12,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[2.8,0],[0,-2.8],[0,0]],"o":[[0,0],[0,-2.8],[-2.8,0],[0,0],[0,0]],"v":[[5,-2.5],[5,-4.5],[0,-9.5],[-5,-4.5],[-5,-2.5]],"c":false},"ix":2},"nm":"Path 2","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":1,"lj":1,"ml":10,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[12,11.5],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":0,"k":0,"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":3,"s":[100],"e":[83]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":11,"s":[83],"e":[83]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":17,"s":[83],"e":[100]},{"t":25}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":28,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"Base","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[12,12,0],"ix":2},"a":{"a":0,"k":[12,12,0],"ix":1},"s":{"a":1,"k":[{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":3,"s":[100,100,100],"e":[97,97,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":6,"s":[97,97,100],"e":[100,100,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":9,"s":[100,100,100],"e":[100,100,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":17,"s":[100,100,100],"e":[97,97,100]},{"i":{"x":[0.667,0.667,0.667],"y":[1,1,1]},"o":{"x":[0.333,0.333,0.333],"y":[0,0,0]},"t":20,"s":[97,97,100],"e":[100,100,100]},{"t":23}],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,-1.1],[1.1,0],[0,1.1],[-1.1,0]],"o":[[0,1.1],[-1.1,0],[0,-1.1],[1.1,0]],"v":[[2,0],[0,2],[-2,0],[0,-2]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[8,-7],[-8,-7],[-8,7],[8,7]],"c":true},"ix":2},"nm":"Path 2","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[12,15],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 2","np":4,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":28,"st":0,"bm":0}],"markers":[]},
        });
        gameover.playerColorOptions.appendChild(option);
        return option;
    };

    challengesSuccess.levelNum = document.getElementById("level-num");
    challengesSuccess.backBtn = challengesSuccess.domElement.getElementsByClassName("back-icon-btn")[0];


    function scrollHorizontally(e) {
        if (e.shiftKey === true) return;
        gameover.playerColorOptions.scrollLeft -= (e.wheelDelta || -e.detail);
        // e.preventDefault();
    }
    gameover.playerColorOptions.addEventListener("mousewheel", scrollHorizontally, { passive: true, });
    gameover.playerColorOptions.addEventListener("DOMMouseScroll", scrollHorizontally, { passive: true, });

    const autoAdaptsSizeCallback = (text, box = text.parentNode) => {
        // console.log(text, box)
        return () => {
            const parentContainerHeight = box.clientHeight;
            const currentTextHeight = text.scrollHeight;
            const currentFontSize = parseInt(window.getComputedStyle(text).fontSize);
            const newFontSize = ~~Math.max(16, Math.min(500, (parentContainerHeight / currentTextHeight) * currentFontSize));
            // text.style.setProperty("font-size", newFontSize + "px");
            box.style.setProperty("--font-size", newFontSize + "px");
        };
    };
    const scoreAutoAdaptsSize = autoAdaptsSizeCallback(playing.nowScore, playing.nowScoreBox);
    // window.addEventListener("resize", scoreAutoAdaptsSize);
    new ResizeObserver(scoreAutoAdaptsSize).observe(playing.nowScore);
    new ResizeObserver(autoAdaptsSizeCallback(gameover.playerColorSelect)).observe(gameover.playerColorSelect.parentNode);

    const fullBtn = document.getElementById("full-screen-icon-btn");
    if (window.isTouchDevice && (
        document.fullscreenEnabled
        || document.msFullscreenEnabled
        || document.webkitFullscreenEnabled
        || document.mozFullscreenEnabled
    )) {
        const requestFullscreen = (document.documentElement.requestFullscreen
            || document.documentElement.mozRequestFullScreen
            || document.documentElement.webkitRequestFullScreen
            || document.documentElement.msRequestFullscreen).bind(document.body);
        const isFullscreen = () => document.body === (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
        if (!isFullscreen()) fullBtn.style.display = "";
        document.documentElement.onfullscreenchange =
        document.documentElement.onmozfullscreenchange =
        document.documentElement.onwebkitfullscreenchange =
        document.documentElement.MSFullscreenChange = function(e) {
            if (e.target === null) return;
            const full = isFullscreen();
            fullBtn.style.display = full? "none": "";
        };
        fullBtn.onclick = () =>
            requestFullscreen().then(async _ => {
                try {
                    await screen.orientation.lock("portrait");
                } catch (e) {
                    console.warn(e);
                    let lockOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
                    if (lockOrientation) lockOrientation.call(screen, "portrait");
                }
                await new Promise(res => setTimeout(res, 200));
                if (["portrait-primary", "portrait-secondary", "portrait"].includes(screen.orientation.type))
                    return;
                // cannot lock screen orientation to portrait
                // remove all callback hooks and exit fullscreen
                document.documentElement.onfullscreenchange =
                document.documentElement.onmozfullscreenchange =
                document.documentElement.onwebkitfullscreenchange =
                document.documentElement.MSFullscreenChange =
                fullBtn.onclick = null;
                const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
                exitFullscreen.call(document);
                fullBtn.style.display = "none";
            }, err => {
                console.warn(err);
            });
    }
    else fullBtn.style.display = "none";

    welcome.settingBtn.onclick = () => {
        welcome.hide();
        setting.show();
    };
    welcome.playBtn.onclick = () => {
        welcome.hide();
        playing.show();
    };
    welcome.levelsModeBtn.onclick = () => {
        welcome.hide();
        challenges.show();
    };
    welcome.addEventListener("onbeforeshow", () => {
        if (playing.isHided()) {
            playing.show("init");
            soundsPromise["bgm"].then(bgm => {
                bgm.play();
            });
        }
    });
    welcome.addEventListener("onshown", () => {
        game.showFirstFrame();
        playing.setCoverColor(game.maps.backgroundColor);
    });

    setting.musicBtn.onclick = () => {
        // if (hasClass(setting.musicBtn, "muted-music-icon-btn")) {
            // removeClass(setting.musicBtn, "muted-music-icon-btn");
        if (setting.musicBtn.classList.contains("muted-music-icon-btn")) {
            setting.musicBtn.classList.remove("muted-music-icon-btn");
            setMute(false);
        }
        else {
            // addClass(setting.musicBtn, "muted-music-icon-btn");
            setting.musicBtn.classList.add("muted-music-icon-btn");
            setMute(true);
        }
    };
    setting.backBtn.onclick = () => {
        setting.hide();
        welcome.show();
    };

    challenges.backBtn.onclick = () => {
        challenges.hide();
        welcome.show();
    };
    for (let i = 0; i < 7; ++i) {
        challenges.levels.innerHTML += `<div>${i + 1}</div>`;
    }
    challenges.levels.onclick = e => {
        if (e.target === challenges.levels) return;
        challenges.currentLevel = Number(e.target.innerHTML);
        challenges.hide();
        playing.show(challenges.currentLevel);
    };

    playing.setCoverColor = function (color = playing.coverColor) {
        if (typeof color === "number") color = "#" + color.toString(16);
        playing.domElement.style.setProperty("--cover-color", color);
        if (color != "transparent") playing.coverColor = color;
    };
    if (isTouchDevice) playing.operationDiscription.getElementsByClassName("pc-device")[0].style.display = "none";
    else playing.operationDiscription.getElementsByClassName("touch-device")[0].style.display = "none";
    playing.addEventListener("onshown", async (msg) => {
        if (history[history.length - 2] !== welcome) {
            playing.nowScore.innerHTML = "";
            playing.nowScore.style.display = "none";
        }
        else {
            playing.nowScore.innerHTML = "0";
            playing.nowScore.style.display = "";
        }
        playing.setCoverColor();
        const { operationDiscription } = playing;
        if (msg !== "init") {
            operationDiscription.style.display = "";
            operationDiscription.style.transition = "none";
            operationDiscription.style.opacity = 1;
            await sleep(0);
            operationDiscription.style.transition = "";
            operationDiscription.style.opacity = 0;
        }
        else operationDiscription.style.display = "none";
    });

    gameover.backBtn.onclick = () => {
        gameover.hide();
        if (history[history.length - 3] === welcome) {
            welcome.show();
        }
        else {
            challenges.show();
        }
    };
    gameover.replayBtn.onclick = () => {
        gameover.hide();
        if (history[history.length - 3] === welcome) {
            welcome.show();
        }
        else {
            playing.show(challenges.currentLevel);
        }
    };
    gameover.playerColorSelect.onclick = () => {};
    gameover.addEventListener("onbeforeshow", () => {
        playing.operationDiscription.style.display = "none";
    });
    gameover.addEventListener("onshown", (score = 0, best = Math.max(score, localStorage.getItem("bestScore") || 0)) => {
        playing.setCoverColor("transparent");
        playing.nowScore.style.display = "none";
        if (history[history.length - 3] === welcome) {
            gameover.backBtn.style.display = "none";
            gameover.info.innerHTML = `<h1>SCORE ${score}</h1><h2>BEST ${best}</h2>`;
            localStorage.setItem("bestScore", best);
        }
        else {
            gameover.backBtn.style.display = "";
            gameover.info.innerHTML = "<h1>CHALLENGE</h1><h1>FAILED!</h1>";
        }
    });
    game.addEventListener("onover", (score) => {
        gameover.show(score);
    });
    gameover.addEventListener("onbeforeshow", () => {
        gameover.currentCrystalCount.innerHTML = localStorage.getItem("currentCrystalCount") || 0;
    });

    challengesSuccess.backBtn.onclick = () => {
        challengesSuccess.hide();
        challenges.show();
    };
    challengesSuccess.addEventListener("onshown", (level) => {
        challengesSuccess.levelNum.innerHTML = level;
        playing.setCoverColor("transparent");
    });
    game.addEventListener("onChallengeSuccess", (level) => {
        challengesSuccess.show(level);
    });
    
    window.addEventListener("keydown", e => {
        if (["Space", "Enter"].includes(e.code)) {
            if (gameover.isShown()) {
                gameover.replayBtn.onclick();
                e.preventDefault();
            }
            else if (welcome.isShown()) {
                welcome.playBtn.onclick();
                e.preventDefault();
            }
        }
    });

    favicon.init();
    rendererInit();
    game.init();
    pcr.init();
}


export {
    loading,
    welcome,
    setting,
    challenges,
    playing,
    gameover,
    challengesSuccess,
    init,
};
