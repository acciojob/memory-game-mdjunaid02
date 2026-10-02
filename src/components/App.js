import React from "react";
import "./../styles/App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      level: null,
      tiles: [],
      selectedTiles: [],
      attempts: 0,
      gameOver: false
    };
  }

  startGame = (level) => {
    let numberOfPairs = 0;

    if (level === "easy") {
      numberOfPairs = 4;
    } else if (level === "normal") {
      numberOfPairs = 8;
    } else if (level === "hard") {
      numberOfPairs = 16;
    }

    const numbers = [];

    for (let i = 1; i <= numberOfPairs; i++) {
      numbers.push(i);
      numbers.push(i);
    }

    // Shuffle tiles
    numbers.sort(() => Math.random() - 0.5);

    const tiles = numbers.map((number, index) => ({
      id: index,
      number: number,
      revealed: false,
      matched: false
    }));

    this.setState({
      level: level,
      tiles: tiles,
      selectedTiles: [],
      attempts: 0,
      gameOver: false
    });
  };

  handleTileClick = (tileId) => {
    const { tiles, selectedTiles, gameOver } = this.state;

    // Don't allow clicks after game is finished
    if (gameOver) {
      return;
    }

    // Don't allow a third tile while checking two tiles
    if (selectedTiles.length === 2) {
      return;
    }

    const clickedTile = tiles.find(
      (tile) => tile.id === tileId
    );

    // Tile doesn't exist
    if (!clickedTile) {
      return;
    }

    // Don't click an already revealed/matched tile
    if (clickedTile.revealed || clickedTile.matched) {
      return;
    }

    const updatedTiles = tiles.map((tile) => {
      if (tile.id === tileId) {
        return {
          ...tile,
          revealed: true
        };
      }

      return tile;
    });

    const newSelectedTiles = [
      ...selectedTiles,
      tileId
    ];

    this.setState(
      {
        tiles: updatedTiles,
        selectedTiles: newSelectedTiles
      },
      () => {
        if (this.state.selectedTiles.length === 2) {
          this.checkMatch();
        }
      }
    );
  };

  checkMatch = () => {
    const {
      tiles,
      selectedTiles,
      attempts
    } = this.state;

    const firstTile = tiles.find(
      (tile) => tile.id === selectedTiles[0]
    );

    const secondTile = tiles.find(
      (tile) => tile.id === selectedTiles[1]
    );

    const newAttempts = attempts + 1;

    // MATCH
    if (firstTile.number === secondTile.number) {
      const updatedTiles = tiles.map((tile) => {
        if (
          tile.id === firstTile.id ||
          tile.id === secondTile.id
        ) {
          return {
            ...tile,
            matched: true
          };
        }

        return tile;
      });

      const allMatched = updatedTiles.every(
        (tile) => tile.matched
      );

      this.setState({
        tiles: updatedTiles,
        selectedTiles: [],
        attempts: newAttempts,
        gameOver: allMatched
      });
    }

    // NOT A MATCH
    else {
      this.setState({
        attempts: newAttempts
      });

      setTimeout(() => {
        const hiddenTiles = this.state.tiles.map(
          (tile) => {
            if (
              tile.id === firstTile.id ||
              tile.id === secondTile.id
            ) {
              return {
                ...tile,
                revealed: false
              };
            }

            return tile;
          }
        );

        this.setState({
          tiles: hiddenTiles,
          selectedTiles: []
        });
      }, 1000);
    }
  };

  render() {
    const {
      level,
      tiles,
      attempts,
      gameOver
    } = this.state;

    return (
      <div>
        <h1>Memory Game</h1>

        <div className="levels_container">

          <label>
            <input
              type="radio"
              id="easy"
              name="level"
              onChange={() =>
                this.startGame("easy")
              }
            />
            Easy
          </label>

          <label>
            <input
              type="radio"
              id="normal"
              name="level"
              onChange={() =>
                this.startGame("normal")
              }
            />
            Normal
          </label>

          <label>
            <input
              type="radio"
              id="hard"
              name="level"
              onChange={() =>
                this.startGame("hard")
              }
            />
            Hard
          </label>

        </div>

        {level && (
          <div>

            <p>
              Attempts: {attempts}
            </p>

            {gameOver && (
              <h2>
                Congratulations! You solved the game!
              </h2>
            )}

            <div className="cells_container">

              {tiles.map((tile) => (
                <div
                  className="cell"
                  key={tile.id}
                  onClick={() =>
                    this.handleTileClick(tile.id)
                  }
                >
                  {tile.revealed || tile.matched
                    ? tile.number
                    : "?"}
                </div>
              ))}

            </div>

          </div>
        )}
      </div>
    );
  }
}

export default App;
