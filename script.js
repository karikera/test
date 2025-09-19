document.addEventListener('DOMContentLoaded', () => {
    const piecesContainer = document.getElementById('puzzle-pieces');
    const boardContainer = document.getElementById('puzzle-board');
    const imageUrl = 'puzzle-image.jpg';
    const ROWS = 4;
    const COLS = 4;
    const PIECE_WIDTH = 100;
    const PIECE_HEIGHT = 100;

    let pieces = [];
    let draggedPiece = null;

    function init() {
        createPieces();
        shufflePieces();
        createBoard();
        renderPieces();
    }

    function createPieces() {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                const piece = document.createElement('div');
                piece.classList.add('puzzle-piece');
                piece.draggable = true;
                piece.style.backgroundImage = `url(${imageUrl})`;
                piece.style.backgroundPosition = `-${j * PIECE_WIDTH}px -${i * PIECE_HEIGHT}px`;
                piece.dataset.row = i;
                piece.dataset.col = j;
                piece.id = `piece-${i}-${j}`;
                pieces.push(piece);

                piece.addEventListener('dragstart', onDragStart);
                piece.addEventListener('dragend', onDragEnd);
            }
        }
    }

    function shufflePieces() {
        pieces.sort(() => Math.random() - 0.5);
    }

    function renderPieces() {
        piecesContainer.innerHTML = '';
        pieces.forEach(piece => {
            piecesContainer.appendChild(piece);
        });
    }

    function createBoard() {
        for (let i = 0; i < ROWS * COLS; i++) {
            const slot = document.createElement('div');
            slot.classList.add('puzzle-slot');
            slot.dataset.index = i;
            slot.addEventListener('dragover', onDragOver);
            slot.addEventListener('dragenter', onDragEnter);
            slot.addEventListener('dragleave', onDragLeave);
            slot.addEventListener('drop', onDrop);
            boardContainer.appendChild(slot);
        }
    }

    function onDragStart(e) {
        draggedPiece = e.target;
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);
    }

    function onDragEnd(e) {
        draggedPiece.style.display = 'block';
        draggedPiece = null;
    }

    function onDragOver(e) {
        e.preventDefault();
    }

    function onDragEnter(e) {
        e.preventDefault();
        e.target.style.backgroundColor = 'rgba(0,0,0,0.1)';
    }

    function onDragLeave(e) {
        e.target.style.backgroundColor = 'transparent';
    }

    function onDrop(e) {
        e.preventDefault();
        e.target.style.backgroundColor = 'transparent';
        if (e.target.classList.contains('puzzle-slot') && !e.target.firstChild) {
            e.target.appendChild(draggedPiece);
            checkWin();
        }
    }

    function checkWin() {
        const slots = boardContainer.children;
        let allCorrect = true;
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            const piece = slot.firstChild;
            if (!piece) {
                allCorrect = false;
                break;
            }
            const pieceRow = parseInt(piece.dataset.row);
            const pieceCol = parseInt(piece.dataset.col);
            const slotIndex = parseInt(slot.dataset.index);
            const expectedRow = Math.floor(slotIndex / COLS);
            const expectedCol = slotIndex % COLS;

            if (pieceRow !== expectedRow || pieceCol !== expectedCol) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            setTimeout(() => {
                alert('Congratulations! You solved the puzzle!');
            }, 100);
        }
    }

    init();
});
