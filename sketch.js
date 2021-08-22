const WIDTH = 800;
const HEIGHT = 800;
const TURN_SPEED = 4;
const SLOWING_FRICTION = 0.9;
const THRUSTER_POWER = 4;
const MAX_VEL = 200;
const NUM_STARS = 20;
const BACKGROUND_VELOCITY = 2;

let gState = {
  direction: 0, // Measured from 3 o'clock
  x: WIDTH / 2,
  y: HEIGHT / 2,
  xVel: 0,
  yVel: 0,
  thruster: 'off',
  stars: [], //{x, y, depth}
};

function setup() {
  createCanvas(WIDTH, HEIGHT);
  angleMode(DEGREES);
  gState = generateStarfield(gState);
}

const generateStarfield = (state) => {
  for (let depth = 1; depth <= 3; depth++) {
    for (let i = 0; i < NUM_STARS * depth; i++) {
      state.stars.push({ x: random(0, 800), y: random(0, 800), depth });
    }
  }
  return state;
};

function draw() {
  background('black');
  drawStarfield(gState);
  drawShip(gState);
  gState = handleInput(gState);
  processState(gState);
}

const drawShip = (state) => {
  push();
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
  pop();
};

const drawStarfield = (state) => {
  state.stars.map(({ x, y, depth }) => {
    drawStar(x, y, 5 - depth);
  });
};

const drawStar = (x, y, size) => {
  circle(x, y, size);
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
