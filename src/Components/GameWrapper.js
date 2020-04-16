import React, { Component } from "react";
var dir = "RIGHT";
document.addEventListener("keypress", (event) => {
  if (event.keyCode === 32) {
    if (dir === "RIGHT") {
      dir = "DOWN";
    } else if (dir === "DOWN") {
      dir = "LEFT";
    } else if (dir === "LEFT") {
      dir = "UP";
    } else if (dir === "UP") {
      dir = "RIGHT";
    }
  }
});
// document.addEventListener("click", () => {
//   if (dir === "RIGHT") {
//     dir = "DOWN";
//   } else if (dir === "DOWN") {
//     dir = "LEFT";
//   } else if (dir === "LEFT") {
//     dir = "UP";
//   } else if (dir === "UP") {
//     dir = "RIGHT";
//   }
// });
class GameWrapper extends Component {
  constructor() {
    super();
    this.state = {
      gameOver: true,
      score: 0,
      frameRate: 8,
      snake: [
        [0, 0],
        [1, 0],
      ],
      food: [],
      cols: 16,
      rows: 24,
      cellSize: 14,
      grid: [],
    };
  }

  setGrid() {
    const { cols, rows, grid } = this.state;
    for (let i = 0; i < rows; i++) {
      var row = [];
      for (let j = 0; j < cols; j++) {
        row.push(j);
      }
      grid.push(row);
    }
    this.setState({ grid: grid }, () => {
      // console.log(this.state.grid);
    });
  }

  addRandomFood() {
    const { cols, rows, food, snake } = this.state;
    var x = Math.floor(Math.random() * cols);
    var y = Math.floor(Math.random() * rows);
    var foodPos = [x, y];
    snake.map((cell) => {
      if (cell[0] === foodPos[0] && cell[1] === foodPos[1]) {
        this.addRandomFood();
      } else {
        this.setState({ food: foodPos });
      }
    });
  }

  addScore() {
    this.setState((prevState) => {
      return { score: (prevState.score += 1), frameRate: (prevState.frameRate += 1) };
    });
  }
  moveSnake() {
    const { snake, food, score, cols, rows, gameOver } = this.state;
    var head = [];
    head[0] = this.state.snake[snake.length - 1][0];
    head[1] = this.state.snake[snake.length - 1][1];

    this.setState((prevState) => {
      if (head[0] < 0 || head[1] < 0 || head[0] >= cols || head[1] >= rows) {
        return { gameOver: true };
      }

      if (!gameOver) {
        if (dir === "RIGHT") {
          head[0] += 1;
          if (head[0] === food[0] && head[1] === food[1]) {
            this.addRandomFood();
            this.addScore();
          } else {
            prevState.snake.shift();
          }
        }
        if (dir === "DOWN") {
          head[1] += 1;
          if (head[0] === food[0] && head[1] === food[1]) {
            this.addRandomFood();
            this.addScore();
          } else {
            prevState.snake.shift();
          }
        }
        if (dir === "LEFT") {
          head[0] -= 1;
          if (head[0] === food[0] && head[1] === food[1]) {
            this.addRandomFood();
            this.addScore();
          } else {
            prevState.snake.shift();
          }
        }
        if (dir === "UP") {
          head[1] -= 1;
          if (head[0] === food[0] && head[1] === food[1]) {
            this.addRandomFood();
            this.addScore();
          } else {
            prevState.snake.shift();
          }
        }
        prevState.snake.push(head);
        for (let i = snake.length - 2; i >= 0; i--) {
          if (
            snake[snake.length - 1][0] === snake[i][0] &&
            snake[snake.length - 1][1] === snake[i][1]
          ) {
            return { gameOver: true };
          }
        }
        return {
          snake: prevState.snake,
        };
      }
    });
  }

  cellStyle(i, j) {
    const { food, snake } = this.state;
    var color = null;
    snake.map((cell) => {
      if (cell[0] === i && cell[1] === j) {
        color = "black";
      }
    });
    if (food[0] === i && food[1] === j) {
      color = "red";
    }
    return {
      backgroundColor: color,

      width: `${this.state.cellSize}px`,
      height: `${this.state.cellSize}px`,
    };
  }

  changeDir() {
    if (dir === "RIGHT") {
      dir = "DOWN";
    } else if (dir === "DOWN") {
      dir = "LEFT";
    } else if (dir === "LEFT") {
      dir = "UP";
    } else if (dir === "UP") {
      dir = "RIGHT";
    }
  }

  startPlay() {
    setInterval(() => {
      this.moveSnake();
    }, 1000 / this.state.frameRate);
    this.setState({ gameOver: false });
  }
  componentDidMount() {
    this.setGrid();
    this.addRandomFood();
  }

  render() {
    const { cellSize, grid, dir, score, gameOver } = this.state;
    return (
      <div className="wrappper">
        <div className="nav">
          <h3>
            Score: {this.state.frameRate} {gameOver ? "Game Over" : null}
          </h3>
          <button onClick={() => this.startPlay()} disabled={!gameOver}>
            Play
          </button>
        </div>
        <div className="grid-wrapper" onClick={this.changeDir}>
          {grid.map((row, i) => {
            return (
              <div key={i} className="row">
                {row.map((cols, j) => {
                  return <div className="col" key={j} style={this.cellStyle(j, i)}></div>;
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default GameWrapper;
