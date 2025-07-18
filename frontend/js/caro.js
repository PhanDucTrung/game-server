const socket = io();

let mySymbol = '';
let myRoom = '';
let isMyTurn = false;

const boardDiv = document.getElementById('board');
const statusDiv = document.getElementById('status');
const roomSelect = document.getElementById('roomSelect');
const joinBtn = document.getElementById('joinBtn');

const boardSize = 15;
let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(''));

// render grid 15x15
function renderBoard() {
  boardDiv.innerHTML = '';
  boardDiv.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (board[r][c] === 'X') cell.classList.add('x');
      if (board[r][c] === 'O') cell.classList.add('o');
      cell.textContent = board[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener('click', () => {
        if (isMyTurn && board[r][c] === '') {
          socket.emit('move', { row: r, col: c, gameId: myRoom });
        }
      });
      boardDiv.appendChild(cell);
    }
  }
}

// clear board state
function initBoard() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(''));
  renderBoard();
}

// handle rooms list
socket.on('rooms', rooms => {
  roomSelect.innerHTML = `<option value="">Create New Room</option>`;
  rooms.forEach(roomId => {
    const opt = document.createElement('option');
    opt.value = roomId;
    opt.textContent = `Room ${roomId}`;
    roomSelect.appendChild(opt);
  });
});

// join room
joinBtn.addEventListener('click', () => {
  const roomId = roomSelect.value;
  socket.emit('join', roomId || null);
});

socket.on('player', ({ symbol, roomId }) => {
  mySymbol = symbol;
  myRoom = roomId;
  statusDiv.textContent = `You are ${symbol} in Room ${roomId}`;
  initBoard();
});

socket.on('start', msg => {
  isMyTurn = mySymbol === 'X';
  statusDiv.textContent = msg + ` It's ${isMyTurn ? 'your' : 'opponent'} turn.`;
});

socket.on('board', ({ board: newBoard, lastMove }) => {
  board = newBoard;
  renderBoard();
  if (lastMove.player !== mySymbol) {
    isMyTurn = true;
    statusDiv.textContent = `Your turn (${mySymbol})`;
  } else {
    isMyTurn = false;
    statusDiv.textContent = `Opponent's turn`;
  }
});

socket.on('win', msg => {
  alert(msg);
  isMyTurn = false;
});

socket.on('reset', () => {
  initBoard();
  statusDiv.textContent = 'Board reset. Waiting…';
});

initBoard();
