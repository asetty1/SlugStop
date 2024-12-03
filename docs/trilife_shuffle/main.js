title = ' TRILIFE SHUFFLE';

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
  // Themes
  // simple
  // pixel
  // shape
  // shapeDark
  // crt
  // dark
  theme: 'crt',
  viewSize: {x: 100, y: 100},
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};

let player;
let buses;
const busCount = 3;
let animTicks;
let multiplier;

function update() {
  if (!ticks) {
    player = {
      pos: vec(50, 80),
      vx: 1,  // y velocity
      dx: 1,  // y direction
      on_bus: 0,
    };
    buses = [];
    multiplier = 0;
    animTicks = 0;
    addbuses();
  }
  animTicks += 1;

  // this draws the road
  color('blue');
  rect(56, 0, 1, 100);
  rect(58, 0, 1, 100);
  rect(44, 0, 1, 100);
  rect(42, 0, 1, 100);

  // uc
  color('white');
  box(vec(51, 21), 15, 9);
  color('yellow');
  box(vec(51, 21), 13, 7);
  color('cyan');
  text('UC', 47, 20);
  // arc(50, 50, 4, 2, 0, 360);

  // store
  color('white');
  box(vec(51, 51), 15, 9);
  color('red');
  box(vec(51, 51), 13, 7);
  color('green');
  text('$', 50, 50);

  // downtown
  color('white');
  box(vec(51, 81), 15, 9);
  color('purple');
  box(vec(51, 81), 13, 7);
  color('light_cyan');
  text('DT', 47, 80);

  // this draws the slug


  const a = floor(animTicks / 7) % 4;
  if (player.on_bus == 0) {
    char(addWithCharCode('a', a === 3 ? 1 : a), player.pos, {
      color: 'yellow',
      // @ts-ignore
      mirror: {x: (player.dx)},
    });
  }



  if (input.isJustPressed) {
    player.vx = 1;
    player.dx *= -1;

    addbuses();
  }
  // makes the slug move forward
  player.pos.x += (player.dx * player.vx) * 0.5 * difficulty;

  // turns slug left and right
  if (player.pos.x <= 40 && player.dx != 1) {
    player.vx = 0;
  } else if (player.pos.x >= 62 && player.dx != -1) {
    player.vx = 0;
  }



  buses.forEach((bus) => {
    // move bus forward
    if (ticks % 100 >= 50) {
      bus.pos.y += bus.vy * 0.5 * difficulty;  
    }

    // picks up player
    if (char('d', bus.pos, {
          color: (
              bus.hasPlayer == 0 ? 'black' :  // bus is white because crt filter
                                   'yellow'),
        }).isColliding.char['a']) {
      bus.hasPlayer = 1;
      player.on_bus = 1;
    }


    if (bus.pos.y <= 0) {  // flips bus when it reaches the end
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
    for (let i = buses.length; i < busCount; i++) {
      addbus(vec(65, 80 - 16 * buses.length));
    }
  }
}

function addbus(pos) {
  buses.push({
    pos: pos,
    vy: -1,
    hasPlayer: 0,
  });
}
