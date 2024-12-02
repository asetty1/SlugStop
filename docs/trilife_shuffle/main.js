title = 'TRILIFE SHUFFLE';

description = `
[Tap] Turn
`;

characters = [
  `
  l l
  lll
 llll
llll
`,
  `
   l l
   lll
 llll
llll
`,
  `
  l l
  lll
 llll
llll
`,
  `
lll
lll
lll
lll
`,
];

options = {
  theme: 'crt',
  viewSize: {x: 100, y: 100},
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};

let player;
let buses;
let animTicks;
let multiplier;

function update() {
  if (!ticks) {
    player = {
      pos: vec(50, 80),
      vy: 1,
      dy: 1,

    };
    buses = [];
    multiplier = 0;
    animTicks = 0;
  }
  animTicks += 1;

  // this draws the road
  color('blue');
  rect(55, 0, 1, 100);
  rect(57, 0, 1, 100);
  rect(45, 0, 1, 100);
  rect(43, 0, 1, 100);

  // this draws the slug
  const ai = floor(animTicks / 7) % 4;
  char(addWithCharCode('a', ai === 3 ? 1 : ai), player.pos, {
    color: 'yellow',
    // @ts-ignore
    mirror: {x: (player.dy)},
  });

  // // this draws the bus
  // const b = floor(animTicks / 7) % 4;
  // char(addWithCharCode('d', b === 3 ? 1 : b), bus.y, bus.x, {
  //   color: 'black',  // bus is white
  // });


  // moves slug left and right
  if (input.isJustPressed) {
    player.vy *= 0;
  }
  if (input.isJustReleased) {
    player.vy = player.dy;
  }

  player.pos.x += player.vy * 0.5 * difficulty;

  if (player.pos.x <= 34) {
    player.vy *= -1;
    player.dy *= -1;
  } else if (player.pos.x >= 64) {
    player.vy *= -1;
    player.dy *= -1;
  }


  // moves bus up and down
  // bus.x += bus.vx * 0.5 * difficulty;
  // if (bus.x <= 0) {
  //   bus.vx *= -1;
  //   bus.y = 35
  // } else if (bus.x >= 100) {
  //   bus.vx *= -1;
  //   bus.y = 65
  // }
}
