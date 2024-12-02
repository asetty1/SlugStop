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
];

options = {
  theme: 'crt',
  viewSize: {x: 100, y: 100},
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};



/** @type {{x: number, y: number, vy: number}} */
let player;
let animTicks;
let multiplier;
let dots;
let powerTicks;

function update() {
  if (!ticks) {
    player = {x: 80, y: 50, vy: -1};
    multiplier = 0;
    powerTicks = animTicks = 0;
  }
  animTicks += 1;



  // moves slug left and right
  if (input.isJustPressed) {
    player.vy *= -1;
  }
  player.y += player.vy * 0.5 * difficulty;

  if (player.y < 34) {
    player.vy *= -1;
  } else if (player.y > 64) {
    player.vy *= -1;
  }



  // this draws the road
  color('blue');
  rect(55, 0, 1, 100);
  rect(57, 0, 1, 100);
  rect(45, 0, 1, 100);
  rect(43, 0, 1, 100);

  // this draws the slug
  color('yellow');
  const ai = floor(animTicks / 7) % 4;
  char(addWithCharCode('a', ai === 3 ? 1 : ai), player.y, player.x, {
    // @ts-ignore
    mirror: {x: player.vy},
  });
}
