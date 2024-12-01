title = 'PAKU PAKU';

description = `
[Tap] Turn
`;

characters = [
  `
  llll
 lll
lll
lll
 lll
  llll
`,
  `
  lll
 lllll
lll
lll
 lllll
  lll
`,
  `
  ll
 llll
llllll
llllll
 llll
  ll
`,
  `
  lll
 l l l
 llll
 llll
llll
l l l
`,
  `
  lll
 l l l
 llll
 llll
 llll
 l l
`,
  `
ll
ll
`,
  `
 ll
llll
llll
 ll
`,
  `
  l l



`,
];

options = {
  theme: 'dark',
  viewSize: {x: 100, y: 100},
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 9,
};

/** @type {{y: number, vy: number}} */
let player;
/** @type {{y: number, eyeVy: number}} */
let enemy;
/** @type {{y: number, isPower: boolean}[]} */
let dots;
let powerTicks;
let animTicks;
let multiplier;

function update() {
  if (!ticks) {
    player = {y: 40, vy: 1};
    enemy = {y: 40, eyeVy: 0};
    multiplier = 0;
    addDots();
    powerTicks = animTicks = 0;
  }
  animTicks += difficulty;
  color('black');
  text(`x${multiplier}`, 3, 9);



  if (input.isJustPressed) {
    player.vy *= -1;
  }
  player.y += player.vy * 0.5 * difficulty;
  if (player.y < 3) {
    player.y = 103;
  } else if (player.y > 100) {
    player.y = -3;
  }



  color('blue');
  rect(33, 0, 1, 100);
  rect(35, 0, 1, 100);
  rect(44, 0, 1, 100);
  rect(46, 0, 1, 100);
  color('green');
  const ai = floor(animTicks / 7) % 4;
  char(addWithCharCode('a', ai === 3 ? 1 : ai), player.y, 30, {
    // @ts-ignore
    mirror: {x: player.vy},
  });

  remove(dots, (d) => {
    color(
        d.isPower && floor(animTicks / 7) % 2 === 0 ? 'transparent' : 'yellow');
    const c = char(d.isPower ? 'g' : 'f', d.y, 30).isColliding.char;
    if (c.a || c.b || c.c) {
      if (d.isPower) {
        play('jump');
        if (enemy.eyeVy === 0) {
          powerTicks = 120;
        }
      } else {
        play('hit');
      }
      addScore(multiplier);
      return true;
    }
  });
  const eyeVy = enemy.eyeVy !== 0 ?
      enemy.eyeVy :
      (player.y > enemy.y ? 1 : -1) * (powerTicks > 0 ? -1 : 1);
  enemy.y = clamp(
      enemy.y +
          eyeVy *
              (powerTicks > 0        ? 0.25 :
                   enemy.eyeVy !== 0 ? 0.75 :
                                       0.55) *
              difficulty,
      0, 100);

  if ((enemy.eyeVy < 0 && enemy.y < 1) || (enemy.eyeVy > 0 && enemy.y > 99)) {
    enemy.eyeVy = 0;
  }
  color(
      powerTicks > 0 ?
          powerTicks < 30 && powerTicks % 10 < 5 ? 'black' : 'blue' :
          enemy.eyeVy !== 0 ? 'black' :
                              'red');
  const c =
      char(
          enemy.eyeVy !== 0 ? 'h' :
                              addWithCharCode('d', floor(animTicks / 7) % 2),
          enemy.y, 30, {
            // @ts-ignore
            mirror: {x: evx},
          })
          .isColliding.char;
  if (enemy.eyeVy === 0 && (c.a || c.b || c.c)) {
    if (powerTicks > 0) {
      play('powerUp');
      addScore(10 * multiplier, enemy.y, 30);
      enemy.eyeVy = player.y > 50 ? -1 : 1;
      powerTicks = 0;
      multiplier++;
    } else {
      play('explosion');
      end();
    }
  }
  powerTicks -= difficulty;
  if (dots.length === 0) {
    play('coin');
    addDots();
  }
}

function addDots() {
  let pi = player.y > 50 ? rndi(1, 6) : rndi(10, 15);
  dots = times(16, (i) => ({x: i * 6 + 5, isPower: i === pi}));
  multiplier++;
}
