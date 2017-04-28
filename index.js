function SnakeGame(cell, row) {
    this.cell = cell;
    this.row = row;
    this.table = document.createElement("table");
    this.table.id = "gameField";

    this.app = document.getElementById('app');

    if (this.app === null) {
        this.app = document.createElement("div");
        this.app.id = "app";
        document.body.appendChild(this.app);
    }

    this.init();
}

SnakeGame.prototype.setCell = function (cell) {
    this.cell = cell;

    this.init();
};

SnakeGame.prototype.setRow = function (row) {
    this.row = row;

    this.init();
};

SnakeGame.prototype.addRow = function () {
    var o = this;
    var row = "";

    for (var i = 1; i <= o.row; i++) {
        row += "<tr>";
        row += o.addCell();
        row += "</tr>";
    }

    return row;
};

SnakeGame.prototype.addCell = function () {
    var o = this;
    var cell = "";

    for (var j = 1; j <= o.cell; j++) {
        cell += "<td></td>";
    }

    return cell;
};

SnakeGame.prototype.startPointer = function () {
    this.snake = [];
    this.char(this.row / 2, this.cell / 2, "init");
    this.bindKey();
};

SnakeGame.prototype.moveSnake = function (move) {
    var o = this;

    if (!!move) {
        var x = o.snake[0]['x'];
        var y = o.snake[0]['y'];

        switch (move) {
            case "up":
                y = y - 1 >= 0 ? y - 1 : o.row - 1;
                break;
            case "left":
                x = x - 1 >= 0 ? x - 1 : o.cell - 1;
                break;

            case "bot":
                y = y + 1 <= o.row - 1 ? y + 1 : 0;
                break;
            case "right":
                x = x + 1 <= o.cell - 1 ? x + 1 : 0;
                break;
        }
        o.clearPane();
        o.char(x, y);
    }
};

SnakeGame.prototype.bindKey = function () {
    var o = this;

    document.onkeydown = function (e) {
        var move = "";

        switch (e.keyCode) {
            case 87:
                move = 'up';
                break;
            case 65:
                move = 'left';
                break;
            case 83:
                move = 'bot';
                break;
            case 68:
                move = 'right';
                break;
            default:
                move = "";
        }

        if (!!move) {
            o.moveSnake(move);
        }
    }
};

SnakeGame.prototype.char = function (x, y, eventChar) {
    var o = this;
    if (!!this.arFeed) {
        if (this.arFeed.length > 0) {
            this.arFeed.forEach(function (item) {
                if ((!!item)) {
                    if (item.y === y && item.x === x) {
                        eventChar = 'feed';
                    }
                }
            });
        }
    }

    if (eventChar === 'init') {
        for (var i = 0; i <= 20; i++) {
            if (i > this.cell / 3) continue;
            this.snake.push({'x': x, 'y': y + i});
        }
    } else if (eventChar === 'feed') {
        this.snake.unshift({'x': x, 'y': y});
        this.snake.push({'x': x, 'y': y});
        this.arFeed = [];
    } else {
        this.snake.pop();
        this.snake.unshift({'x': x, 'y': y});
    }
    o.charRender();
};

SnakeGame.prototype.charRender = function () {
    var o = this;
    if (o.snake.length > 0) {
        o.snake.forEach(function (item) {
            o.table.rows[item.y].cells[item.x].style["background-color"] = "#000";
        });
    }
};

SnakeGame.prototype.clearPane = function () {
    var o = this;
    var eventChar = '';

    for (var x = 0; x <= o.cell; x++) {
        for (var y = 0; y <= o.row; y++) {
            if (this.arFeed.length > 0) {
                this.arFeed.forEach(function (item) {
                    if ((!!item)) {
                        if (item.y === y && item.x === x) {
                            eventChar = 'feed';
                        }
                    }
                });
            }

            if (eventChar === 'feed') {
                eventChar = '';
                continue;
            }

            if ((!!o.table.rows[y] && !!o.table.rows[y].cells[x])) {
                o.table.rows[y].cells[x].style["background-color"] = "#fff";
            }
        }
    }
};

SnakeGame.prototype.styleTable = function () {

    this.table.style["border-spacing"] = 0;
    this.table.style["border-collapse"] = "collapse";

    document.querySelectorAll('td').forEach(function (item) {
        item.style.width = "5px";
        item.style.height = "5px";
        item.style.border = "1px solid";
    });
};

SnakeGame.prototype.feed = function () {
    var o = this;
    this.arFeed = [];
    setInterval(function () {
        if (o.arFeed.length === 0) {
            o.arFeed = (o.feedRandomCoords());
        }
    }, 100)
};

SnakeGame.prototype.feedRandomCoords = function () {
    var x = getRandomInt(0, this.cell);
    var y = getRandomInt(0, this.row);
    var arFeed = [];
    if (!!y && !!x) {
        var feed = true;

        this.snake.forEach(function (item) {
            if (item.y === y && item.x === x) {
                feed = false;
            }
        });

        if (feed) {
            if ((!!this.table.rows[y] && !!this.table.rows[y].cells[x])) {
                this.table.rows[y].cells[x].style["background-color"] = "#000";
                arFeed = [{x: x, y: y}];
            }
        }
    }

    return arFeed;
};

SnakeGame.prototype.init = function () {
    this.table.innerHTML = this.addRow();
    this.app.appendChild(this.table);
    this.styleTable();
    this.startPointer();
    this.moveSnake();
    this.feed();
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

new SnakeGame(20, 20);