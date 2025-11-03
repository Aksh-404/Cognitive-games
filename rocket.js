// DOM Elements
const timeEl = document.getElementById('time');
const qNumEl = document.getElementById('qNum');
const gridEl = document.getElementById('grid-container');
const fEl = document.getElementById('feedback');
const startBtn = document.getElementById('start-btn');
const launchBtn = document.getElementById('launch-btn');
const resetBtn = document.getElementById('reset-btn');
const controlsEl = document.getElementById('controls');
const boardEl = document.getElementById('game-board');
const rocketAnimEl = document.getElementById('rocket-anim');

// --- Arrow & Junction Definitions ---
const ARROWS = {
    'up': '⬆️',
    'down': '⬇️',
    'left': '⬅️',
    'right': '➡️',
    't-up': '⬅️⬆️➡️', // T-junction, open up
    't-down': '⬅️⬇️➡️',
    't-left': '⬆️⬅️⬇️',
    't-right': '⬆️➡️⬇️',
    'cross': '➕'
};

// --- Level Definitions ---
const levels = [
    { // Level 1: 4x4, simple path
        gridSize: 4,
        start: { r: 1, c: 0 }, // Row 1, Grid Col 0
        end: { r: 2, c: 4 },   // Row 2, Grid Col 4 (Earth)
        cells: [
            // Row 0
            [ {t: 'empty'}, {t: 'arrow', d: 'down'}, {t: 'empty'}, {t: 'empty'} ],
            // Row 1
            [ {t: 'arrow', d: 'right'}, {t: 'arrow', d: 'right', c: true, r: ['right', 'down']}, {t: 'arrow', d: 'down'}, {t: 'empty'} ],
            // Row 2
            [ {t: 'empty'}, {t: 'arrow', d: 'up'}, {t: 'arrow', d: 'right', c: true, r: ['right', 'up']}, {t: 'arrow', d: 'right'} ],
            // Row 3
            [ {t: 'empty'}, {t: 'empty'}, {t: 'empty'}, {t: 'arrow', d: 'up'} ]
        ]
    },
    { // Level 2: 4x4, T-junction
        gridSize: 4,
        start: { r: 0, c: 0 },
        end: { r: 3, c: 4 },
        cells: [
            // Row 0
            [ {t: 'arrow', d: 'right'}, {t: 'arrow', d: 'right'}, {t: 'arrow', d: 'down'}, {t: 'empty'} ],
            // Row 1
            [ {t: 'empty'}, {t: 'arrow', d: 'down'}, {t: 'arrow', d: 'left', c: true, r: ['left', 'down']}, {t: 'empty'} ],
            // Row 2
            [ {t: 'arrow', d: 'right'}, {t: 't-down', d: 't-down', c: true, r: ['t-down', 't-up']}, {t: 'arrow', d: 'right'}, {t: 'arrow', d: 'down'} ],
            // Row 3
            [ {t: 'empty'}, {t: 'arrow', d: 'up'}, {t: 'empty'}, {t: 'arrow', d: 'right'} ]
        ]
    },
    { // Level 3: 5x5, complex
        gridSize: 5,
        start: { r: 2, c: 0 },
        end: { r: 2, c: 5 },
        cells: [
            // Row 0
            [ {t: 'empty'}, {t: 'empty'}, {t: 'arrow', d: 'down'}, {t: 'arrow', d: 'down'}, {t: 'empty'} ],
            // Row 1
            [ {t: 'arrow', d: 'right'}, {t: 'arrow', d: 'down'}, {t: 'arrow', d: 'left'}, {t: 'arrow', d: 'left'}, {t: 'arrow', d: 'down'} ],
            // Row 2
            [ {t: 'arrow', d: 'right'}, {t: 't-up', d: 't-up', c: true, r: ['t-up', 't-right']}, {t: 'arrow', d: 'up'}, {t: 'cross', d: 'cross', c: true, r: ['cross', 't-left']}, {t: 'arrow', d: 'right'} ],
            // Row 3
            [ {t: 'empty'}, {t: 'arrow', d: 'up'}, {t: 'empty'}, {t: 'arrow', d: 'up'}, {t: 'arrow', d: 'up'} ],
            // Row 4
            [ {t: 'empty'}, {t: 'empty'}, {t: 'empty'}, {t: 'empty'}, {t: 'empty'} ]
        ]
    }
];

// Game State
let qNum = 0;
let time = 240;
let timer;
let currentLvl;
let gridState = []; // This will be our working copy of the grid
let gameActive = false;

// --- Game Logic ---

function startGame() {
    startBtn.classList.add('hidden');
    controlsEl.classList.remove('hidden');
    boardEl.classList.remove('hidden');
    qNum = 0;
    loadLevel(qNum);
}

function loadLevel(levelIdx) {
    if (levelIdx >= levels.length) {
        endGame();
        return;
    }
    
    gameActive = true;
    qNum = levelIdx;
    currentLvl = levels[qNum];
    
    // Deep copy level data into gridState
    gridState = JSON.parse(JSON.stringify(currentLvl.cells));
    
    // Reset timer
    clearInterval(timer);
    time = 240;
    timeEl.textContent = '4:00';
    timer = setInterval(updateTimer, 1000);
    
    qNumEl.textContent = qNum + 1;
    fEl.textContent = 'Click the arrows to change their direction. Find the path!';
    fEl.style.color = '#555';

    // Set icons
    document.querySelector('.icon-area.start').style.gridRow = currentLvl.start.r + 1;
    document.querySelector('.icon-area.end').style.gridRow = currentLvl.end.r + 1;
    
    drawGrid();
}

function drawGrid() {
    gridEl.innerHTML = '';
    const size = currentLvl.gridSize;
    gridEl.style.gridTemplateColumns = `repeat(${size}, 60px)`;
    gridEl.style.gridTemplateRows = `repeat(${size}, 60px)`;
    
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cellData = gridState[r][c];
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.r = r;
            cell.dataset.c = c;
            
            if (cellData.t !== 'empty') {
                cell.innerHTML = ARROWS[cellData.d] || '?';
            }
            if (cellData.c) { // changeable
                cell.classList.add('changeable');
                cell.addEventListener('click', () => handleCellClick(r, c));
            }
            
            gridEl.appendChild(cell);
        }
    }
}

function handleCellClick(r, c) {
    if (!gameActive) return;

    const cellData = gridState[r][c];
    if (!cellData.c) return; // Not changeable

    // Find current direction in its rotation list
    const curIdx = cellData.r.indexOf(cellData.d);
    // Get next index, looping back to 0
    const nextIdx = (curIdx + 1) % cellData.r.length;
    
    // Set new direction
    cellData.d = cellData.r[nextIdx];
    
    // Update the visual
    const cellEl = getCell(r, c);
    cellEl.innerHTML = ARROWS[cellData.d] || '?';
}

function handleReset() {
    fEl.textContent = 'Grid has been reset.';
    loadLevel(qNum); // Just reload the current level
}

function handleLaunch() {
    if (!gameActive) return;
    gameActive = false; // Prevent clicks during animation
    
    const path = findPath();
    
    if (path.success) {
        fEl.textContent = 'Success! Path found!';
        fEl.style.color = '#2ecc71';
        animateRocket(path.path);
        // next level will be called by animateRocket
    } else {
        fEl.textContent = 'Launch failed! The path is incomplete or leads to a dead end.';
        fEl.style.color = '#e74c3c';
        gameActive = true; // Allow user to try again
    }
}

function findPath() {
    let pos = { r: currentLvl.start.r, c: currentLvl.start.c };
    let path = []; // Path of coordinates [ {r, c}, {r, c} ]
    
    // Add a "virtual" start point just outside the grid
    let startOffset = { r: pos.r, c: -1 }; 
    path.push(startOffset);
    path.push(pos);

    for (let i = 0; i < 30; i++) { // Max 30 steps to prevent infinite loops
        // Check if we reached the end
        if (pos.r === currentLvl.end.r && pos.c === currentLvl.end.c) {
            path.push({ r: currentLvl.end.r, c: currentLvl.end.c + 1 }); // Add virtual end point
            return { success: true, path: path };
        }
        
        // Check if out of bounds
        if (pos.r < 0 || pos.r >= currentLvl.gridSize || pos.c < 0 || pos.c >= currentLvl.gridSize) {
            return { success: false }; // Went off grid
        }

        const cell = gridState[pos.r][pos.c];
        const dir = cell.d;
        
        // --- This is the core logic ---
        // Based on arrow type, find next position
        // This is a simplified check. A real T-junction (e.g., 't-up')
        // would need to know which way you *entered* it.
        // For this game, we'll assume arrows just point.
        
        if (dir === 'up' || dir === 't-left' || dir === 't-right' || dir === 't-up' || dir === 'cross') {
            pos = { r: pos.r - 1, c: pos.c };
        } else if (dir === 'down' || dir === 't-down' || dir === 'cross') {
            pos = { r: pos.r + 1, c: pos.c };
        } else if (dir === 'left' || dir === 't-left' || dir === 'cross') {
            pos = { r: pos.r, c: pos.c - 1 };
        } else if (dir === 'right' || dir === 't-right' || dir === 'cross') {
            pos = { r: pos.r, c: pos.c + 1 };
        } else {
             return { success: false }; // 'empty' or invalid
        }

        // Add new position to path
        path.push(pos);
    }
    
    return { success: false }; // Loop ended
}

function animateRocket(path) {
    // Calculate cell size and grid offset
    const gridRect = gridEl.getBoundingClientRect();
    const gameRect = boardEl.getBoundingClientRect();
    
    let step = 0;
    
    function moveStep() {
        if (step >= path.length) {
            // Animation finished
            rocketAnimEl.style.opacity = '0';
            fEl.textContent = `Level ${qNum + 1} Cleared!`;
            setTimeout(() => loadLevel(qNum + 1), 1500); // Load next
            return;
        }
        
        const pos = path[step];
        
        // Calculate pixel position
        // The +0.5 is to center it in the cell
        const x = (pos.c + 0.5) * 60 + (gridEl.offsetLeft - boardEl.offsetLeft);
        const y = (pos.r + 0.5) * 60 + (gridEl.offsetTop - boardEl.offsetTop);

        // For first step, just appear
        if (step === 0) {
            rocketAnimEl.style.transition = 'opacity 0.3s';
            rocketAnimEl.style.left = `${x}px`;
            rocketAnimEl.style.top = `${y}px`;
            rocketAnimEl.style.opacity = '1';
        } else {
            // For other steps, move
            rocketAnimEl.style.transition = 'top 0.3s linear, left 0.3s linear, opacity 0.3s';
            rocketAnimEl.style.left = `${x}px`;
            rocketAnimEl.style.top = `${y}px`;
        }
        
        step++;
        setTimeout(moveStep, 350); // Time per step
    }
    
    moveStep(); // Start the animation
}

function endGame() {
    gameActive = false;
    clearInterval(timer);
    boardEl.classList.add('hidden');
    controlsEl.classList.add('hidden');
    fEl.textContent = 'Great work! You finished all 3 levels.';
    startBtn.textContent = 'Play Again?';
    startBtn.classList.remove('hidden');
}

function updateTimer() {
    time--;
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    timeEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    
    if (time <= 0) {
        clearInterval(timer);
        gameActive = false;
        fEl.textContent = 'Time out! Resetting level...';
        loadLevel(qNum); // Restart current level
    }
}

// --- Helper Functions ---
function getCell(r, c) {
    return document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
}

// Start Button Event
startBtn.addEventListener('click', startGame);
launchBtn.addEventListener('click', handleLaunch);
resetBtn.addEventListener('click', handleReset);