# ShiftingCubes
A Cube, made out of little cubes that are shifting around

![Shifting Cubes](https://raw.githubusercontent.com/johnnyawesome/ShiftingCubes/master/ShiftingCubes/DemoImages/ShiftingCubes.gif)

## Info

The Project is written in JavaScript, using the [P5JS library](https://p5js.org/).

All little cubes are objects that move around on their own.

## Credit

This was not my idea, all the credit goes to the YouTube-channel [RenderedByBlender](https://www.youtube.com/channel/UCjwgRphtiLuhYVlEv_0sEdw) who posted [this video](https://www.youtube.com/watch?v=S7kdxLIwsIA).
He did it using Blender and Python, I made my own version in P5JS, ready for the web!

## How to use

You can change these variables to adjust cube-parameters to your liking:

```javascript
//Size of the cubes
const cubeSize = 60;
//Distance between cubes
const cubeDist = 15;
const delta = cubeSize + cubeDist;
//Length in cubes of one side (e.g. '5' will produce a 5 x 5 x 5 cube)
const cubeNum = 5;
```

Change this block to create more free spots ("holes") inside the big cube:

```js
//To leave some empty slots, there is a 15% chance
//that a cube will not be set
if (1 + Math.floor(Math.random() * 100) <= 15) {
  cubes.push(new Cube(xOff, yOff, -zOff, cubeSize, false))
} else {
  cubes.push(new Cube(xOff, yOff, -zOff, cubeSize, true));
}
```

Change this bit increase / decrease the chance that a little cube moves:

```js
/*
Randomizes if a cube moves, even if it found an empty slot:
Too much simultaneous movement makes the cube look too busy
*/
randomizeMove(index) {
  if (Math.floor(Math.random() * 50) === 0) this.changeCoords(index);
}
```

