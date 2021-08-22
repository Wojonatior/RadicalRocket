const WIDTH = 800;
const HEIGHT = 800;
const TURN_SPEED = 4;
const SLOWING_FRICTION = 0.9;
const THRUSTER_POWER = 4;
const MAX_VEL = 200;

let gState = {
  direction: 0, // Measured from 3 o'clock
  x: WIDTH / 2,
  y: HEIGHT / 2,
  xVel: 0,
  yVel: 0,
  thruster: 'off',
};

function setup() {
  createCanvas(WIDTH, HEIGHT);
  angleMode(DEGREES);
}

function draw() {
  background('black');
  drawShip(gState);
  gState = handleInput(gState);
  processState(gState);
}

const drawShip = (state) => {
  translate(state.x, state.y);
  rotate(state.direction);
  strokeWeight(1);
  if (state.thruster === 'on') {
    fill('blue');
    stroke('magenta');
    triangle(-10, 0, 0, 10, 0, -10);
  }
  fill('white');
  stroke('white');
  triangle(40, 0, 0, 10, 0, -10);
};

const handleInput = (state) => {
  // TODO: Investigate different key repeat speeds
  if (keyIsDown(LEFT_ARROW)) {
    state.direction -= TURN_SPEED;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    state.direction += TURN_SPEED;
  }
  if (keyIsDown(UP_ARROW)) {
    state.thruster = 'on';
  } else {
    state.thruster = 'off';
  }

  return state;
};

const processState = (state) => {
  if (state.thruster === 'on') {
    state.xVel += cos(state.direction) * THRUSTER_POWER;
    state.yVel += sin(state.direction) * THRUSTER_POWER;
  }
  state.x += state.xVel;
  state.y += state.yVel;

  state.xVel *= SLOWING_FRICTION;
  state.yVel *= SLOWING_FRICTION;
  state.xVel = constrain(state.xVel, -1 * MAX_VEL, MAX_VEL);
  state.yVel = constrain(state.yVel, -1 * MAX_VEL, MAX_VEL);
};

// Keep a momentum vector
// The > the delta beweeen momentum and pointed direction
// the more
