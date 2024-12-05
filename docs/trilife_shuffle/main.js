title = ' TRILIFE';

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
  seed: 7,
};

let player;
let buses;
const busCount = 3;
let animTicks;
let timer;
let goal;

function update() {
  if (!ticks) {
    player = {
      pos: vec(50, 35),
      vx: 1,  // y velocity
      dx: 1,  // y direction
      on_bus: -1,
      streak: 1,
    };
    buses = [];
    animTicks = 0;
    addbuses();
    timer = 10;
    goal = Math.floor(Math.random() * 3) + 1;
  }
  const a = floor(animTicks / 7) % 4;  // this animates the slug
  animTicks += 1;
  slime();
  //===========================Background===========================
  // this draws the road
  color('blue');
  rect(56, 0, 1, 100);
  rect(58, 0, 1, 100);
  rect(44, 0, 1, 100);
  rect(42, 0, 1, 100);

  // uc
  if (goal == 1 && animTicks % 40 >= 40 / 2)
    color('green');
  else
    color('white');
  box(vec(51, 21), 15, 9);


  color('yellow');
  box(vec(51, 21), 13, 7);
  color('cyan');
  text('UC', 47, 20);

  // store
  if (goal == 2 && animTicks % 40 >= 40 / 2)
    color('green');
  else
    color('white');
  box(vec(51, 51), 15, 9);


  color('red');
  box(vec(51, 51), 13, 7);
  color('green');
  text('$', 50, 50);

  // downtown
  if (goal == 3 && animTicks % 40 >= 40 / 2)
    color('green');
  else
    color('white');
  box(vec(51, 81), 15, 9);

  color('purple');
  box(vec(51, 81), 13, 7);
  color('light_cyan');
  text('DT', 47, 80);

  //===========================Timer===========================

  // draws timer
  if (timer > 3) {
    color('black');
  } else {
    color('red')
  }
  text(timer.toString().substring(0, 4), 10, 40);
  timer -= .01 * difficulty;

  if (timer < 0) {
    timer = 0;
    end();
  }
  text('x' + player.streak.toString(), 15, 48);


  //===========================Score===========================
  if (player.on_bus == -1) {
    switch (goal) {
      case 1:
        if (char(addWithCharCode('a', a === 3 ? 1 : a), player.pos, {
              color: 'yellow',
              // @ts-ignore
              mirror: {x: (player.dx)},
            }).isColliding.rect.yellow) {
          addScore(100 * player.streak, player.pos.x, player.pos.y);
          player.streak += 1;
          timer += 2;
          while (goal == 1) {
            goal = Math.floor(Math.random() * 3) + 1;
          };
          play('coin');
        }
        break;
      case 2:
        if (char(addWithCharCode('a', a === 3 ? 1 : a), player.pos, {
              color: 'yellow',
              // @ts-ignore
              mirror: {x: (player.dx)},
            }).isColliding.rect.red) {
          addScore(100 * player.streak, player.pos.x, player.pos.y);
          player.streak += 1;
          timer += 2;
          while (goal == 2) {
            goal = Math.floor(Math.random() * 3) + 1;
          };
          play('coin');
        }
        break;
      case 3:
        if (char(addWithCharCode('a', a === 3 ? 1 : a), player.pos, {
              color: 'yellow',
              // @ts-ignore
              mirror: {x: (player.dx)},
            }).isColliding.rect.purple) {
          addScore(100 * player.streak, player.pos.x, player.pos.y);
          player.streak += 1;
          timer += 2;
          while (goal == 3) {
            goal = Math.floor(Math.random() * 3) + 1;
          };
          play('coin');
        }
        break;
      default:
        // score sound
    }
  }

  //===========================Player===========================
  // tap to turn
  if (input.isJustPressed) {
    if (player.on_bus == -1) {
      play('select');
      player.vx = 1;
      player.dx *= -1;
    } else {  // player can only get off bus 5 pixels away from edge of screen
      if (buses[player.on_bus].pos.y > 5 && buses[player.on_bus].pos.y < 95) {
        play('hit');
        getoffbus();
      }
    }
  }
  // makes the slug move left and right
  player.pos.x += (player.dx * player.vx) * 0.5 * difficulty;

  // turns slug left and right
  if (player.pos.x <= 40 && player.dx != 1) {
    player.vx = 0;
  } else if (player.pos.x >= 62 && player.dx != -1) {
    player.vx = 0;
  }

  //===========================Bus===========================
  buses.forEach((bus, i) => {
    movebus(bus);

    // draws bus
    char('d', bus.pos, {
      color: (
          bus.hasPlayer == false ? 'black' :  // bus is white because crt filter
                                   'yellow'),
    })

    // picks up player
    if (player.on_bus == -1 &&
        // draws player
        char(addWithCharCode('a', a === 3 ? 1 : a), player.pos, {
          color: 'yellow',
          // @ts-ignore
          mirror: {x: (player.dx)},
        }).isColliding.char['d']) {
      bus.hasPlayer = true;
      bus.wait += 15;
      player.on_bus = i;
    }

    if (bus.pos.y < 0) {  // flips bus when it reaches the top
      bus.vy *= -1;
      bus.pos.x = 35;
      bus.pos.y = 1;
      if (bus.hasPlayer) {
        player.dx *= -1;
      }
    } else if (bus.pos.y > 100) {  // flips bus when it reaches the bottom
      bus.vy *= -1;
      bus.pos.x = 65;
      bus.pos.y = 99;
      if (bus.hasPlayer) {
        player.dx *= -1;
      }
    }
  })
}

//===========================Helper Functions===========================
function addbuses() {
  while (buses.length < busCount) {
    for (let i = buses.length; i < busCount; i++) {
      addbus(vec(65, 90 - 16 * buses.length));
    }
  }
}

function addbus(pos) {
  buses.push({
    pos: pos,
    vy: -1,
    hasPlayer: false,
    wait: 0,
  });
}
function getoffbus() {
  buses[player.on_bus].wait = 45;

  player.pos.x = buses[player.on_bus].pos.x;
  player.pos.y = buses[player.on_bus].pos.y;

  player.pos.x += 6 * buses[player.on_bus].vy;  // gets of left side of bus

  // buses[player.on_bus].hasPlayer = false;

  player.on_bus = -1;
  buses.forEach(bus => {
    bus.hasPlayer = false;
  });

  player.vx = 1;
  player.dx *= -1;
}

function movebus(bus) {
  buses.forEach(otherbus => {
    if (otherbus.wait > 0 && bus != otherbus &&
        bus.pos.x == otherbus.pos.x) {  // if 2 buses going the same direction

      if (bus.vy == -1 && bus.pos.y > otherbus.pos.y &&
          bus.pos.y < otherbus.pos.y + 10) {
        bus.wait = 50;
      }

      if (bus.vy == 1 && bus.pos.y > otherbus.pos.y - 10 &&
          bus.pos.y < otherbus.pos.y) {
        bus.wait = 50;
      }

    } else {
      if (bus.wait <= 0) {
        bus.pos.y += bus.vy * 0.2 * difficulty;  // move bus forward
      } else {
        bus.wait -= 1;
      }
    }
  });
}

function slime() {
  if (player.on_bus == -1) {
    color('black');
    particle(
        vec(player.pos.x, player.pos.y + 1), 1, .3,
        (player.dx == -1 ? PI * 2 : PI), .1);
  }
}