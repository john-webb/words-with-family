import './styles.css';
import Scrabble from './scrabble/Scrabble';
import { Player } from './scrabble/Player';
import { Board } from './scrabble/Board';

let game = new Scrabble();
game.addPlayer(new Player('Alice'));
game.addPlayer(new Player('Bob'));
game.startGame();

console.log('Game started!');

const boardElement = document.querySelector('.board');
const boardSizeInput = document.getElementById('board-size') as HTMLInputElement;

if (!boardElement) {
    throw new Error('Board element is null');
}

function renderBoard(board: Board, element: Element) {
    element.innerHTML = ''; // Clear existing board
    document.documentElement.style.setProperty('--grid-size', board.BOARD_SIZE.toString());

    for (const { x, y, square } of board.gridIterator()) {
        const squareElement = document.createElement('div');
        squareElement.className = 'square';
        squareElement.dataset.row = x.toString();
        squareElement.dataset.col = y.toString();

        // Add special square classes and titles
        if (square.special === 'double-word') {
            squareElement.classList.add('double-word');
            squareElement.title = 'Double Word Score';
            squareElement.innerText = 'DW';
        } else if (square.special === 'triple-word') {
            squareElement.classList.add('triple-word');
            squareElement.title = 'Triple Word Score';
            squareElement.innerText = 'TW';
        } else if (square.special === 'double-letter') {
            squareElement.classList.add('double-letter');
            squareElement.title = 'Double Letter Score';
            squareElement.innerText = 'DL';
        } else if (square.special === 'triple-letter') {
            squareElement.classList.add('triple-letter');
            squareElement.title = 'Triple Letter Score';
            squareElement.innerText = 'TL';
        } else if (square.special === 'center-star') {
            squareElement.classList.add('center-star');
            squareElement.title = 'Center Star';
            squareElement.innerText = '*';
        }

        element.appendChild(squareElement);
    }
}

boardSizeInput.addEventListener('change', () => {
    const newSize = parseInt(boardSizeInput.value, 10);
    game = new Scrabble(newSize);
    game.addPlayer(new Player('Alice'));
    game.addPlayer(new Player('Bob'));
    game.startGame();
    renderBoard(game.getBoard(), boardElement);
});

// Initial render
renderBoard(game.getBoard(), boardElement);
