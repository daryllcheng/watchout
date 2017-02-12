// start slingin' some d3 here.
const gameOptions = {
  height: 450,
  width: 700,
  enemies: 30,
  padding: 20
};

let gameStats = {
  score: 0,
  highScore: 0,
  health: 50
};

// set health
d3.select('.scoreboard').selectAll('svg')
  .data([gameStats.health])
  .enter()
  .append('svg')
  .attr('height', '10')
  .append('rect')
  .attr('class', 'healthBar')
  .attr('width', d => d * 15+'px')
  .attr('height', '10')
  .attr('fill', 'red');

// set board
let gameBoard = d3.select('.board').append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)
  .attr('class', 'game')

// prepare to add images
gameBoard
  .append('filter')
  .attr('id', 'shuriken')
  .attr('x', '0%')
  .attr('y', '0%')
  .attr('width', '100%')
  .attr('height', '100%')
  .append('feImage')
  .attr('xlink:href', 'shuriken.png');

gameBoard
  .append('filter')
  .attr('id', 'ninja')
  .attr('x', '0%')
  .attr('y', '0%')
  .attr('width', '100%')
  .attr('height', '100%')
  .append('feImage')
  .attr('xlink:href', 'ninja.gif');

let enemies = [...Array(30).keys()]
  .map( (enemy, index) => {
    let enemyObj = {};
    enemyObj.id = index;
    enemyObj.x = Math.random()*gameOptions.width;
    enemyObj.y = Math.random()*gameOptions.height;
    return enemyObj;
});

// set enemyCircle on the board
let enemyCircle = gameBoard.selectAll('circle')
  .data(enemies)
  .enter()
  .append('circle')
  .attr('class', 'enemy')
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', 10)
  .attr('filter', 'url(#shuriken)');

// behavior dragging
let drag = d3.behavior.drag()
  .on("drag", function(d,i) {
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      d3.select(this).attr("transform", function(d,i){
          return "translate(" + [ d.x, d.y ] + ")"
  })
});

  // set player
let player = {
  height: 30,
  width: 30,
  x: 330,
  y: 230
}

let playerSquare = gameBoard.selectAll('.mouse')
  .data([player])
  .enter()
  .append('rect')
  .attr('width', d => d.width)
  .attr('height', d => d.height)
  .attr("transform", "translate(" + 330 + "," + 230 + ")")
  .attr('filter', 'url(#ninja)')
  .call(drag);



// move enemyCircle
let changePos = function() {
  enemies.forEach(enemy => {
    enemy.x = Math.random()*gameOptions.width;
    enemy.y = Math.random()*gameOptions.height;
  })
};

let moveEnemies = function() { 
  enemies.forEach(function(enemy) {
    enemy.previousX = enemy.x;
    enemy.previousY = enemy.y;
  });
  changePos()
  enemyCircle.transition()
  .duration(2000)
  .attr('cx', d => d.x)
  .attr('cy', d => d.y);
}
setInterval(moveEnemies, 2000);

//Collision
let determineCollisions = function() {
  let result = false;
  let playerPositions = () => d3.transform(playerSquare.attr('transform')).translate;

  for (let i = 0; i < enemies.length; i++) {
    let singleCircleX = d3.select('.enemy:nth-child(' + (i+3).toString() + ')').attr('cx');
    let singleCircleY = d3.select('.enemy:nth-child(' + (i+3).toString() + ')').attr('cy');
    if (Math.abs(singleCircleX - playerPositions()[0]) < 20 && Math.abs(singleCircleY - playerPositions()[1]) < 20) {
      result = true;
    }
  }
  return result;
};

let collisionEffects = function() {
  if (determineCollisions()) {
    gameStats.health--;
    d3.select('.healthBar').data([gameStats.health]).attr('width', d => d * 15+'px');
    if (gameStats.health === 0) {
      if (gameStats.score > gameStats.highScore) {
        gameStats.highScore = gameStats.score;
      }
      gameStats.score = 0;
      gameStats.health = 50;
    }
  }
}

let throttled = _.throttle(collisionEffects, 100);

// var incrementCollisions = function() {
//     if (determineCollisions()) {

//     if (gameStats.score > gameStats.highScore) {
//       gameStats.highScore = gameStats.score;
//     }
//     gameStats.score = 0;
//     gameStats.health++;
//   }
// }

let updateHighScore = () => d3.select('.highscore').select('span').text(gameStats.highScore);
let updateScore = () => d3.select('.current').select('span').text(gameStats.score);
let updateHealth = () => d3.select('.health').select('span').text(gameStats.health);
setInterval(function() {
  // incrementCollisions();
  throttled();
  gameStats.score++;
  // determineCollisions();
  updateHealth();
  updateScore();
  updateHighScore();
}, 50);

