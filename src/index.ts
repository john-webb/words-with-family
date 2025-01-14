import './styles.css';
import Scrabble from './scrabble/Scrabble';
import { Player } from './scrabble/Player';

export const game = new Scrabble();
game.addPlayer(new Player('Alice'));
game.addPlayer(new Player('Bob'));
game.startGame();

console.log('Game started!');

const board = game.getBoard();
const boardElement = document.querySelector('.board');

if (!boardElement) {
    throw new Error('Board is null');
}

// Set CSS grid properties based on board size
const boardSize = board.BOARD_SIZE;
document.documentElement.style.setProperty('--grid-size', boardSize.toString());

for (const { x, y, square } of board.gridIterator()) {
    const squareElement = document.createElement('div');
    squareElement.className = 'square';
    squareElement.dataset.row = x.toString();
    squareElement.dataset.col = y.toString();

    // Add special square classes
    if (square.special === 'double-word') {
        squareElement.classList.add('double-word');
    } else if (square.special === 'triple-word') {
        squareElement.classList.add('triple-word');
    } else if (square.special === 'double-letter') {
        squareElement.classList.add('double-letter');
    } else if (square.special === 'triple-letter') {
        squareElement.classList.add('triple-letter');
    } else if (square.special === 'center-star') {
        squareElement.classList.add('center-star');
    }

    boardElement.appendChild(squareElement);
}
