const WIDTH = 800;
const HEIGHT = 800;
const TURN_SPEED = 4;
const SLOWING_FRICTION = 0.99;
const THRUSTER_POWER = 2;
const MAX_VEL = 200;
const NUM_STARS = 20;
const STARFIELD_WIDTH = WIDTH * 2;
const STARFIELD_HEIGHT = HEIGHT * 2;
const TEXT_SIZE = 30;

let gState = {
  direction: 0, // Measured from 3 o'clock
  x: 0,
  y: 0,
  xVel: 0,
  yVel: 0,
  thruster: 'off',
  stars: [], //{x, y, depth}
  planets: [{ x: 100, y: 100, size: 30 }],
};

function setup() {
  createCanvas(WIDTH, HEIGHT);
  angleMode(DEGREES);
  gState = generateStarfield(gState);
}

const generateStarfield = (state) => {
  // Stars feel kinda clumped in blocks when moving
  for (let depth = 1; depth <= 6; depth++) {
    for (let i = 0; i < NUM_STARS * depth; i++) {
      state.stars.push({
        x: random(0, STARFIELD_WIDTH),
        y: random(0, STARFIELD_HEIGHT),
        depth,
      });
    }
  }
  return state;
};

function draw() {
  background('black');
  drawStarfield(gState);
  drawShip(gState);
  drawPlanets(gState);
  gState = handleInput(gState);
  processState(gState);
  debugValues({
    x: gState.x,
    y: gState.y,
    xVel: gState.xVel,
    yVel: gState.yVel,
    planetVisible: isPlanetVisible(gState.planets[0], gState),
  });
}

const drawShip = (state) => {
  push();
  translate(WIDTH / 2, HEIGHT / 2);
  rotate(state.direction);
  strokeWeight(1);
  // Add some more visual interest to the thruster
  // Flickering, crackling and popping when it turns off
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

Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
};

const drawStarfield = (state) => {
  state.stars.map(({ x, y, depth }) => {
    push();
    const starX =
      ((0 - state.x) / depth + x).mod(STARFIELD_WIDTH) - // Constrain to tile size
      (STARFIELD_WIDTH - WIDTH) / 2; // Offset to align center of the tile with the center of the viewable area
    const starY =
      ((0 - state.y) / depth + y).mod(STARFIELD_HEIGHT) -
      (STARFIELD_HEIGHT - HEIGHT) / 2;
    drawStar(starX, starY, 5 - depth / 2);
    pop();
  });
};

const drawStar = (x, y, size) => {
  // Maybe make the stars dim/fade or draw a cross shape instead
  // Play around with different star colors
  circle(x, y, size);
};

const isPlanetVisible = (planet, state) => {
  const minBoundX = state.x - WIDTH / 2;
  const minBoundY = state.y - HEIGHT / 2;
  const maxBoundX = state.x + WIDTH / 2;
  const maxBoundY = state.y + HEIGHT / 2;
  return (
    planet.x > minBoundX &&
    planet.x < maxBoundX &&
    planet.y > minBoundY &&
    planet.y < maxBoundY
  );
};

const drawPlanets = (state) => {
  state.planets.map(({ x, y, size }) => {
    push();
    const planetX = x - state.x + WIDTH / 2;
    // const planetX = x + state.x + WIDTH / 2;
    const planetY = y - state.y + HEIGHT / 2;
    translate(planetX, planetY);
    fill('green');
    circle(0, 0, size);
    pop();
  });
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
  // Thruster more powerful over time
  // I want the ship to have more heft as it turns, instead of just discarding momentum
  if (state.thruster === 'on') {
    state.xVel += cos(state.direction) * THRUSTER_POWER;
    state.yVel += sin(state.direction) * THRUSTER_POWER;
  }

  // Invert the motion since the stars move, not the ship
  state.x += state.xVel;
  state.y += state.yVel;

  state.xVel *= SLOWING_FRICTION;
  state.yVel *= SLOWING_FRICTION;
  state.xVel = constrain(state.xVel, -1 * MAX_VEL, MAX_VEL);
  state.yVel = constrain(state.yVel, -1 * MAX_VEL, MAX_VEL);
};

// Keep a momentum vector
// The > the delta beweeen momentum and pointed direction
// the more momentum gets sent laterally?

const debugValues = (values) => {
  push();
  textSize(TEXT_SIZE);
  fill('white');
  let yCoord = TEXT_SIZE;
  Object.entries(values).map(([key, value]) => {
    text(`${key}: ${Math.round(value)}`, 0, yCoord);
    yCoord += TEXT_SIZE;
  });
  pop();
};
