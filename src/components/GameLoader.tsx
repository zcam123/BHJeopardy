import React, { ChangeEvent } from "react";

import { GameData } from "../types";
import sample_game from "../assets/sample_game.json";
import { logEvent } from "../util/analytics";
import BlackHoleGame from "../assets/BlackHole.json";

import "./GameLoader.css";

interface GameLoaderProps {
  updateGame: (game: GameData) => void;
}

function GameLoader(props: GameLoaderProps) {
  const { updateGame } = props;

  function validateGame(data: any): GameData | null {
    const game = data.game;
    if (game === undefined) {
      console.log("Game key not found in JSON payload.");
      return null;
    }
    // TODO: additional validation
    return game;
  }

  function handleGameUpload(event: ChangeEvent<HTMLInputElement>) {
    logEvent("Upload Game");
    if (event.target.files === null) {
      return;
    }
    event.target.files[0].text().then((text) => {
      const data: any = JSON.parse(text);
      const game = validateGame(data);
      if (game !== null) {
        updateGame(data);
      } else {
        console.log("Invalid game.");
      }
    });
  }

  function downloadSampleGame() {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(sample_game, null, 4)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "sample_game.json";
    document.body.appendChild(element);
    element.click();
  }

  function handlePlayGame() {
    logEvent("Start Game");
    const gameData: GameData = {
      players: [],
      round: "single",
      game: {
        single: BlackHoleGame.game.single.map(category => ({
          ...category,
          clues: category.clues.map(clue => ({
            ...clue,
            dailyDouble: false,
            html: false,
            chosen: false
          }))
        })),
        double: [],
        final: {
          category: "Final Black Holes",
          clue: "Final clue here",
          solution: "Final solution here",
          html: false
        }
      }
    };
    updateGame(gameData);
  }

  return (
    <div className="game-loader" style={{ position: 'relative' }}>
      <img 
        src={process.env.PUBLIC_URL + "/albert.png"} 
        alt="Albert Einstein" 
        style={{ 
          position: 'absolute',
          right: '20px',
          top: '160px',
          maxWidth: '370px',
          height: 'auto'
        }} 
      />
      <img 
        src={process.env.PUBLIC_URL + "/chandra.png"} 
        alt="Chandra Observatory" 
        style={{ 
          position: 'absolute',
          left: '20px',
          top: '220px',
          maxWidth: '425px',
          height: 'auto'
        }} 
      />
      <h1>Black Hole Jeopardy</h1>
      <p>By Zachary Menard and Logan Ruzzier with inspiration from Brian Yu</p>
      <hr />
      <h2>Play a Game</h2>
      <button 
        onClick={handlePlayGame}
        style={{
          padding: '10px 20px',
          fontSize: '1.2em',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          margin: '10px 0'
        }}
      >
        Play Game
      </button>
      <hr />
      <h2>Create a Game</h2>
      <div className="create-your-own">
        To create a Jeopardy game, download the below game configuration file,
        edit it to include your desired clues, and re-upload it here.
        <div>
          <button onClick={downloadSampleGame}>Download Configuration</button>
        </div>
      </div>
      <img 
        src={process.env.PUBLIC_URL + "/black_hole_binary.png"} 
        alt="test" 
        style={{ display: 'block', margin: '20px auto', maxWidth: '500px', height: 'auto' }} 
      />
    </div>
  );
}

export default GameLoader;
