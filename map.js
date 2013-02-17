var _ = require('underscore');

module.exports = function() {

  this.randomPos = function() {
    return {
      x: parseInt(Math.random() * this.width),
		  y: parseInt(Math.random() * this.height)
    };
  };

	this.width = 80;
	this.height = 40;

  var that = this; // that makes the current object accessible from an inner function
	this.terrain = function() {
    return _.range(that.height).map(function() {
      return _.range(that.width).map(function() { return "."; });
    });
  };

  this.snakes = [];

	this.placeSnake = function(snake) {
    this.snakes.push(snake);
		snake.setPos(this.randomPos());
	};

	this.moveSnake = function(snake, movement) {
		x = snake.head().x + movement.x;
    if (x >= this.width) { x = 0; }
    if (x < 0) { x = this.width - 1; }

		y = snake.head().y + movement.y;
    if (y >= this.height) { y = 0; }
    if (y < 0) { y = this.height - 1; }

    var newPos = {x: x, y: y};
    if (_(newPos).isEqual(this.food)) {
      snake.length++;
      this.placeFood();
    }
    
		snake.setPos(newPos);
	};

  this.placeFood = function() {
    this.food = this.randomPos();
  };

	this.toString = function() {
		var result = this.terrain();

    if (this.food !== undefined) {
      result[this.food.y][this.food.x] = '+';
    }
    _(this.snakes).each(function(snake) {
      _(snake.positions).each(function(pos) {
        result[pos.y][pos.x] = snake.character;
      });
    });

    return _(result).map(function(row) {
			return row.join("") + "\n";
		}).join("");
	};

  this.startAutoMoving = function(opts) {
    var that = this;
    var interval = 300;
    var autoMover = function() {
      _(that.snakes).each(function(snake) {
        that.moveSnake(snake, snake.lastDirection)
      });
      opts.afterEachMove();
    };
    setInterval(autoMover, interval);
  };

};

