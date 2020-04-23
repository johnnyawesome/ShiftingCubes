/// <reference path="../TSDef/p5.global-mode.d.ts" />

"use strict";

//Size of the cubes
const cubeSize = 60;
//Distance between cubes
const cubeDist = 15;
const delta = cubeSize + cubeDist;
//Length in cubes of one side (e.g. '5' will produce a 5 x 5 x 5 cube)
const cubeNum = 5;
//The array that holds all cubes
let cubes = [];

function setup() {
  createCanvas(650, 650, WEBGL);
  angleMode(DEGREES);
  generateCubes(cubeSize, cubeNum);
  smooth();
}

function draw() {
  //Cosmetics like camera angle, lights, translations etc.
  camera(1000, -500, -500, 0, 0, 0, 0, 1, 1);
  rotateX(-50);
  rotateZ(-50);
  translate(50, 150, -100);
  background(30);
  lights();
  pointLight(255, 255, 255, 1000, -1000, -1000);
  pointLight(250, 250, 250, 1000, 300, -400);
  /*Goes through the cubes-array and:
      - Checks for empty slots (neighbors)
      - Displays all cubes
  */
  cubes.forEach(cube => {
    cube.checkNeighbors();
    cube.display();
  });
}

//Generates the big cube out of little cubes
function generateCubes(cubeSize, cubeNum) {

  //Offset between cubes
  let xOff = 0;
  let yOff = 0;
  let zOff = 0;

  for (let ix = 0; ix < cubeNum; ix++) {
    //delta = cube-size + distance between cubes
    xOff += delta;
    for (let iy = 0; iy < cubeNum; iy++) {
      yOff += delta;
      for (let iz = 0; iz < cubeNum; iz++) {
        zOff += delta;
        //To leave some empty slots, there is a 15% chance
        //that a cube will not be set
        if (1 + Math.floor(Math.random() * 100) <= 15) {
          cubes.push(new Cube(xOff, yOff, -zOff, cubeSize, false))
        } else {
          cubes.push(new Cube(xOff, yOff, -zOff, cubeSize, true));
        }
      }
      zOff = 0;
    }
    yOff = 0;
  }
}

//Cube class
class Cube {
  /*Constructor takes parameters for all axis, cube-size and set-state */
  constructor(_x, _y, _z, _size, _set) {
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.size = _size;
    this.set = _set;
    //Moving-flag for moving cubes
    this.moving = false;
    //Destination coordinates of moving cubes
    this.newX = 0;
    this.newY = 0;
    this.newZ = 0;
  }

  display() {
    //Color the cubes
    stroke(200)
    let cubeColor = color(200);
    cubeColor.setAlpha(255);
    fill(cubeColor);

    //Display non-moving (static) cubes
    if (this.set && this.moving === false) {
      push();
      translate(this.x, this.y, this.z);
      box(this.size);
      pop();
    }
    if (this.moving) {
      //Move the Cubes
      if ((this.x - this.newX) >= 0) this.x -= 2;
      if ((this.y - this.newY) >= 0) this.y -= 2;
      if ((this.z - this.newZ) >= 0) this.z -= 2;
      if ((this.x - this.newX) <= 0) this.x += 2;
      if ((this.y - this.newY) <= 0) this.y += 2;
      if ((this.z - this.newZ) <= 0) this.z += 2;

      /*If the cube is at it's destination, stop the motion
      this.x - this.newX can result in a positive or negative number:
      Math.abs converts negative numbers to positive.
      If the is within 1 pixel to it's destination...
      */
      if (this.newX && Math.abs(this.x - this.newX) <= 1
        && this.newY && Math.abs(this.y - this.newY) <= 1
        && this.newZ && Math.abs(this.z - this.newZ) <= 1) {
        //...it moves to the destination...
        this.x = this.newX;
        this.y = this.newY
        this.z = this.newZ
        //...and the destination and moving-flag get reset
        this.newX = 0;
        this.newY = 0;
        this.newZ = 0;
        this.moving = false;
      }

      //Draws set moving cubes
      if (this.set) {
        push();
        translate(this.x, this.y, this.z);
        box(this.size);
        pop();
      }
    }
  }

  //Loops through the array of cubes to find empty slots to move to
  checkNeighbors() {

    for (let i = 0; i < cubes.length; i++) {

      /*Checks the cube and the current cube from the array
      for their set / moving state:
          - Only this cube must be set
          - The array-cube must not be set (must be an empty slot)
          - Both cubes must not ve moving
      */
      if (this.set
        && this.moving === false
        && cubes[i].set === false
        && cubes[i].moving === false) {

        //Check all axis for empty slots to move to:

        //Check Back
        if (this.x === cubes[i].x
          && this.y === cubes[i].y
          && this.z - delta === cubes[i].z) {
          //If a empty slot is found,
          //the decision to move over is randomized
          this.randomizeMove(i)
        }
        //Check Front
        if (this.x === cubes[i].x
          && this.y === cubes[i].y
          && this.z + delta === cubes[i].z) {
          this.randomizeMove(i)
        }
        //Check Left
        if (this.z === cubes[i].z
          && this.y === cubes[i].y
          && this.x - delta === cubes[i].x) {
          this.randomizeMove(i)
        }
        //Check Right
        if (this.z === cubes[i].z
          && this.y === cubes[i].y
          && this.x + delta === cubes[i].x) {
          this.randomizeMove(i)
        }
        //Check Down
        if (this.z === cubes[i].z
          && this.x === cubes[i].x
          && this.y - delta === cubes[i].y) {
          this.randomizeMove(i)
        }

        //Check Up
        if (this.z === cubes[i].z
          && this.x === cubes[i].x
          && this.y + delta === cubes[i].y) {
          this.randomizeMove(i)
        }
      }
    }
  }

  /*
  Randomizes if a cube moves, even if it found an empty slot:
  Too much simultaneous movement makes the cube look too busy
  */
  randomizeMove(index) {
    if (Math.floor(Math.random() * 50) === 0) this.changeCoords(index);
  }

  /*Changes the coordinates of both cubes:
      - The visible Cube
      - The invisible Cube (empty slot)

    Both cubes will switch places:
      - The moving-flag is set
      - Both cubes exchange their coordinates
  */
  changeCoords(index) {
    this.moving = true;
    this.newX = cubes[index].x;
    this.newY = cubes[index].y;
    this.newZ = cubes[index].z;

    cubes[index].moving = true;
    cubes[index].newX = this.x;
    cubes[index].newY = this.y;
    cubes[index].newZ = this.z;
  }
}

