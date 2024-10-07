import React, { useState, useEffect } from 'react';
import './App.css';

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const calculateWinner = (squares) => {
  for (let combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.every((square) => square !== null)) {
    return 'tie';
  }
  return null;
};

const findBestMove = (board) => {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = 'O';
      let score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
};

const minimax = (board, isMaximizing) => {
  const scores = { X: -1, O: 1, tie: 0 };
  const winner = calculateWinner(board);

  if (winner) return scores[winner];
  if (board.every((cell) => cell !== null)) return scores['tie'];

  if (isMaximizing) {    // maximize ai
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'O';
        let score = minimax(board, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {    // minimize user
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'X';
        let score = minimax(board, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};


const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isGameOn, setIsGameOn] = useState(true);
  const winner = calculateWinner(board);


  useEffect(() => {
    if (winner) {
      setTimeout(() => {
        setIsGameOn(false)
        resetGame();
        setIsGameOn(true)
      }, 2000);
      return;
    }

    if (!isPlayerTurn && !winner) {
      const bestMove = findBestMove(board);
      if (bestMove !== null) {
        const newBoard = [...board];
        newBoard[bestMove] = 'O';
        setBoard(newBoard);
        setIsPlayerTurn(true);
      }
    }
  }, [isPlayerTurn, board, winner]);


  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
  };

  return (
    <div className="flex select-none flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-gray-800 transition-all duration-500">
      <h1 className="text-4xl font-bold mb-4 text-gray-300 transition-transform transform hover:scale-105">
        Tic-Tac-Toe
      </h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((value, index) => (
          <button
            key={index}
            disabled={!isGameOn}
            className="w-24 h-24 text-2xl border-2 border-blue-500 hover:bg-gray-700 text-gray-300 transition-colors duration-300 transform hover:scale-105"
            onClick={() => handleClick(index)}
          >
            {value}
          </button>
        ))}
      </div>
      {winner && winner !== 'tie' && (
        <h2 className="mt-4 text-2xl text-gray-200 transition-opacity duration-300 fade-in">
          {`Winner is: ${winner}`}
        </h2>
      )}

      {winner === 'tie' && (
        <h2 className="mt-4 text-2xl text-gray-200 transition-opacity duration-300 fade-in">
          {'It\'s a tie!'}
        </h2>
      )}

      <button onClick={resetGame} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-all duration-300 transform hover:scale-105">
        Reset
      </button>

    </div>
  );
};

export default App;