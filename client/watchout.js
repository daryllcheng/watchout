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
  collisions: 0
};

const coordinates = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

// set board
let gameBoard = d3.select('.board').append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)
  .attr('class', 'game');

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
  .attr('fill', 'blue')

// behavior dragging

var drag = d3.behavior.drag()
  .on("drag", function(d,i) {
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      d3.select(this).attr("transform", function(d,i){
          return "translate(" + [ d.x, d.y ] + ")"
  })
});

  // set player
let player = {
  height: 15,
  width: 15,
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
  .attr('fill', 'red')
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
  .duration(1000)
  .attr('cx', d => d.x)
  .attr('cy', d => d.y);
}
setInterval(moveEnemies, 2000);

//Collision
let playerPositions = () => d3.transform(playerSquare.attr('transform')).translate;

// let enemyPositions = () => enemies.map(enemy => [enemy.x, enemy.y]);
// let determineCollisions = function() {
//   return enemyPositions().some(function(enemy) {
//     return (Math.abs(enemy[0] - playerPositions()[0]) < 10 && Math.abs(enemy[1] - playerPositions()[1]) < 10);
//   })
// };

// let determineCollisions = function(t) {
//   return enemies.some(function(enemy) {
//     if (!(enemy.previousX && enemy.previousY)) {
//       return Math.abs(enemy.x - playerPositions()[0]) < 10 && Math.abs(enemy.y - playerPositions()[0]) < 10;
//     } else {
//     return (Math.abs(enemy.previousX + (enemy.x - enemy.previousX) * t  - playerPositions()[0]) < 10 
//       && Math.abs(enemy.previousY + (enemy.y - enemy.previousY) * t - playerPositions()[1]) < 10);
//     }
//   })
// };
let determineCollisions = function() {
  var result = false;
  for (var i = 0; i < enemies.length; i++) {
    var singleCircleX = d3.select('circle:nth-child(' + (i+1).toString() + ')').attr('cx');
    var singleCircleY = d3.select('circle:nth-child(' + (i+1).toString() + ')').attr('cy');
    if (Math.abs(singleCircleX - playerPositions()[0]) < 20 && Math.abs(singleCircleY - playerPositions()[1]) < 20) {
      result = true;
    }
  }
  return result;
};

// setInterval(determineCollisions, 100);

//Update current score
// setInterval(() => gameStats.score++, 100);


// var incrementCollisions = function() {
//     if (determineCollisions()) {

//     if (gameStats.score > gameStats.highScore) {
//       gameStats.highScore = gameStats.score;
//     }
//     gameStats.score = 0;
//     gameStats.collisions++;
//   }
// }

var updateHighScore = () => d3.select('.highscore').select('span').text(gameStats.highScore);
var updateScore = () => d3.select('.current').select('span').text(gameStats.score);
var updateCollisions = () => d3.select('.collisions').select('span').text(gameStats.collisions);
setInterval(function() {
  // incrementCollisions();
  gameStats.score++;
  // determineCollisions();
  updateCollisions();
  updateScore();
  updateHighScore();
}, 100);

setInterval(function() {
  if (determineCollisions()) {

    if (gameStats.score > gameStats.highScore) {
      gameStats.highScore = gameStats.score;
    }
    gameStats.score = 0;
    gameStats.collisions++;
  }
}, 10);