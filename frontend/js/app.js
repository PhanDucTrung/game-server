function startLine98() {
  const socket = io();

  const boardEl = document.getElementById("line98Board");
  const resetBtn = document.getElementById("resetBtn");

  let selected = null;
  let prevBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
  let isAnimating = false;

  socket.emit("getState");

  resetBtn.addEventListener("click", () => {
    socket.emit("reset");
  });

  
  function renderBoard(state) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cellEl = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
        if (!cellEl) {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          cell.dataset.row = i;
          cell.dataset.col = j;
          boardEl.appendChild(cell);
        }
      }
    }

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cellEl = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
        const value = state.board[i][j];

        // 💡 ALWAYS clean up old ball
        cellEl.innerHTML = "";

        if (value === 0) continue;

        const ball = document.createElement("div");
        ball.classList.add("ball", "appear");
        ball.style.backgroundColor = getColor(Math.abs(value));
        ball.style.width = value > 0 ? "30px" : "15px";
        ball.style.height = value > 0 ? "30px" : "15px";
        cellEl.appendChild(ball);
      }
    }

    prevBoard = state.board.map(row => [...row]);
  }

  function animateMove(from, path, onComplete) {
    isAnimating = true;

    const [fx, fy] = from;
    const fromCell = document.querySelector(`.cell[data-row="${fx}"][data-col="${fy}"]`);
    const ballEl = fromCell.querySelector(".ball");
    if (!ballEl) {
      isAnimating = false;
      onComplete && onComplete();
      return;
    }

    let step = 1;

    function nextStep() {
      if (step >= path.length) {
        isAnimating = false;
        onComplete && onComplete();
        return;
      }

      const [nx, ny] = path[step];
      const nextCell = document.querySelector(`.cell[data-row="${nx}"][data-col="${ny}"]`);
      nextCell.appendChild(ballEl);

      step++;
      setTimeout(nextStep, 100);
    }

    nextStep();
  }

  socket.on("state", (state) => {
    if (!isAnimating) {
      renderBoard(state);
    }
  });

  socket.on("moveResult", (data) => {
    animateMove(data.path[0], data.path, () => {
      prevBoard = data.board.map(row => [...row]);
      renderBoard(data);
    });
  });
boardEl.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell) return;

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const value = prevBoard[row][col];

  if (selected) {
    socket.emit("moveBall", { from: selected, to: [row, col] });
    clearSelection();
    selected = null;
  } else if (value > 0) {
    clearSelection();
    selected = [row, col];
    const selectedCell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"] .ball`
    );
    if (selectedCell) {
      selectedCell.classList.add("selected");
    }
  }
});

function clearSelection() {
  document.querySelectorAll(".ball.selected").forEach((el) => {
    el.classList.remove("selected");
  });
}

}

function getColor(num) {
  const colors = ["red", "green", "blue", "yellow", "purple", "orange", "cyan"];
  return colors[(num - 1) % colors.length];
}




