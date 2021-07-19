# Desire Path

[https://jerrychan7.github.io/desire_path](https://jerrychan7.github.io/desire_path)



[Desire Path](https://apps.apple.com/us/app/desire-path/id1244158812) is a small game developed by [Dead Cool](https://www.appgremlin.com/) in July 2017 and published by [Nanovation](http://www.nanovationlabs.com/). I found this game on my old Android phone, and I cannot find it in Google Play now. Maybe I was playing a pirated version, or it was just taken off the shelf.

You can see the official preview trailer of Dead Cool [here](https://youtu.be/LNqkKSgMYLA).

Anyway, this game is an isometric 2d game. I am learning [Three.js](https://threejs.org/), so as a practice, I rebuild it using 3d, and you can now [play in the browser](https://jerrychan7.github.io/desire_path).

Besides, I used the sound files extracted from the Android application package to get a better gaming experience. I know this behavior is illegal, please do not report me.



# Development

A complete development environment requires a node.js environment.
And run `npm i`.

## How To Run

There have several ways to preview game during development. Choose according to your environment.

### node.js (Highly recommended)

```bash
node server.js
```

Or

```bash
npm i http-serve -g
http-serve
```

### VS Code Extension (recommended)

* [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
* [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server)

### python

```bash
python -m http.server [port]
```

> To avoid 304, you can force refresh chrome or firefox by pressing `CTRL + F5`.



## TODO

* Cube color customization
* weather and time
    * cloud,
    * snow,
    * rain,
    * starry sky,
    * and related bgm
* High contrast simplified version
