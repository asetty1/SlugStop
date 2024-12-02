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
const busCount = 8;
let animTicks;
let multiplier;

function update() {
  if (!ticks) {
    player = {
      pos: vec(50, 80),
      vx: 1,  // y player velocity
      dx: 1,  // y animation direction

    };
    buses = [];
    multiplier = 0;
    animTicks = 0;
  }
  addbuses();
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
    mirror: {x: (player.dx)},
  });

  // this draws the bus
  const b = floor(animTicks / 7) % 1;
  char(addWithCharCode('d', b === 3 ? 1 : b), buses[b].pos, {
    color: 'black',  // bus is white
  });


  // turns slug left and right
  if (input.isJustPressed) {
    player.vx *= 0;
  }
  if (input.isJustReleased) {
    player.vx = player.dx;
  }
  // makes the slug move forward
  player.pos.x += player.vx * 0.5 * difficulty;

  if (player.pos.x <= 40 && player.vx != 1) {
    player.vx *= -1;
    player.dx *= -1;
  } else if (player.pos.x >= 62 && player.vx != -1) {
    player.vx *= -1;
    player.dx *= -1;
  }



  // moves bus up and down
  buses.forEach((bus) => {
    bus.pos.y += bus.vy * 0.5 * difficulty;

    if (bus.pos.y <= 0) {
      bus.vy *= -1;
      bus.pos.x = 35;
    } else if (bus.pos.y >= 100) {
      bus.vy *= -1;
      bus.pos.x = 65;
    }
  })
}

function addbuses() {
  while (buses.length < busCount) {
    for (let i = 1; i <= 5; i++) {
      console.log(i);
    }
    addbus(vec(65, 80));
  }
}

function addbus(pos) {
  buses.push({
    pos: pos,
    vy: -1,
  });
}
