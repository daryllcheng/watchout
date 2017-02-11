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

var playerXEvent;
var playerYEvent;
var drag = d3.behavior.drag()
  .on("drag", function(d,i) {
    console.log(d);
    console.log(d.x);
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
  .attr('x', d => d.x) // change later to be dynamic
  .attr('y', d => d.y) // change later to be dynamic

// var playerXPosition = playerSquare.data()[0].x;
// var playerYPosition = playerSquare.data()[0].y;

playerSquare
  .attr('width', d => d.width)
  .attr('height', d => d.height)
  .attr('fill', 'red')
  .call(drag);
// var playerXPosition = playerSquare.data()[0].x;
// var playerYPosition = playerSquare.data()[0].y;
// playerSquare
//   .attr("transform", "translate(" + x + "," + y + ")")



// var playerXPosition = playerSquare.attr('x');
// var playerYPosition = playerSquare.attr('y');

// playerSquare
//   .attr("transform", "translate(" + playerXPosition + "," + playerYPosition + ")")
  



// move enemyCircle
let changePos = function() {
  enemies.forEach(enemy => {
    enemy.x = Math.random()*gameOptions.width;
    enemy.y = Math.random()*gameOptions.height;
  })
};

let moveEnemies = function() {  
  changePos()
  enemyCircle.transition()
  .duration(1000)
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
}
setInterval(moveEnemies, 2000);