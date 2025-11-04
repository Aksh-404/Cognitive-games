// DOM Elements
const timeEl = document.getElementById('time');
const qNumEl = document.getElementById('qNum');
const keysHeldEl = document.getElementById('keys-held');
const keysTotalEl = document.getElementById('keys-total');
const gridEl = document.getElementById('grid-container');
const fEl = document.getElementById('feedback');
const startBtn = document.getElementById('start-btn');
const showAnswerBtn = document.getElementById('show-answer-btn'); // --- NEW ---

// --- UPDATED: Level Definitions (Now 10 Levels) ---
const levels = [
    { // Level 1: 5x5, 1 key (Original)
        grid: 5,
        startPos: {r: 4, c: 2},
        path: [
            {r: 4, c: 2}, {r: 3, c: 2}, {r: 3, c: 1}, {r: 2, c: 1}, {r: 1, c: 1}, // Path to key
            {r: 1, c: 2}, {r: 1, c: 3}, {r: 0, c: 3}  // Path to door
        ],
        keyPos: [{r: 1, c: 1}],
        doorPos: {r: 0, c: 3}
    },
    { // Level 2: 6x6, 1 key (Original)
        grid: 6,
        startPos: {r: 5, c: 0},
        path: [
            {r: 5, c: 0}, {r: 4, c: 0}, {r: 3, c: 0}, {r: 3, c: 1}, {r: 3, c: 2}, {r: 2, c: 2}, // Path to key
            {r: 1, c: 2}, {r: 1, c: 3}, {r: 1, c: 4}, {r: 2, c: 4}, {r: 2, c: 5}, {r: 1, c: 5}, {r: 0, c: 5} // Path to door
        ],
        keyPos: [{r: 2, c: 2}],
        doorPos: {r: 0, c: 5}
    },
    { // Level 3: 7x7, 2 keys (Original)
        grid: 7,
        startPos: {r: 6, c: 3},
        path: [
            {r: 6, c: 3}, {r: 5, c: 3}, {r: 5, c: 2}, {r: 4, c: 2}, {r: 3, c: 2}, {r: 3, c: 1}, {r: 2, c: 1}, // Path to key 1
            {r: 1, c: 1}, {r: 1, c: 2}, {r: 1, c: 3}, {r: 1, c: 4}, {r: 1, c: 5}, // Path to key 2
            {r: 2, c: 5}, {r: 3, c: 5}, {r: 3, c: 6}, {r: 2, c: 6}, {r: 1, c: 6}, {r: 0, c: 6} // Path to door
        ],
        keyPos: [{r: 2, c: 1}, {r: 1, c: 5}],
        doorPos: {r: 0, c: 6}
    },
    { // Level 4: 7x7, 1 key (Original 4)
        grid: 7,
        startPos: {r: 6, c: 0},
        path: [
            {r: 6, c: 0}, {r: 5, c: 0}, {r: 4, c: 0}, {r: 4, c: 1}, {r: 3, c: 1}, {r: 2, c: 1}, 
            {r: 2, c: 2}, {r: 2, c: 3}, {r: 2, c: 4}, // Path to key
            {r: 2, c: 5}, {r: 1, c: 5}, {r: 0, c: 5}, {r: 0, c: 6} // Path to door
        ],
        keyPos: [{r: 2, c: 4}],
        doorPos: {r: 0, c: 6}
    },
    { // Level 5: 8x8, 2 keys (Original 5)
        grid: 8,
        startPos: {r: 7, c: 4},
        path: [
            {r: 7, c: 4}, {r: 7, c: 3}, {r: 6, c: 3}, {r: 5, c: 3}, {r: 5, c: 2}, {r: 4, c: 2}, {r: 4, c: 1}, {r: 3, c: 1}, // Path to key 1
            {r: 2, c: 1}, {r: 2, c: 0}, {r: 1, c: 0}, {r: 1, c: 1}, {r: 1, c: 2}, {r: 1, c: 3}, {r: 1, c: 4}, 
            {r: 1, c: 5}, {r: 1, c: 6}, {r: 2, c: 6}, {r: 2, c: 7}, // Path to key 2
            {r: 3, c: 7}, {r: 3, c: 6}, {r: 4, c: 6}, {r: 4, c: 5}, {r: 4, c: 4}, {r: 3, c: 4}, 
            {r: 2, c: 4}, {r: 1, c: 4}, {r: 0, c: 4} // Path to door
        ],
        keyPos: [{r: 3, c: 1}, {r: 2, c: 7}],
        doorPos: {r: 0, c: 4}
    },
    { // Level 6: 8x8, 3 keys (Original 6)
        grid: 8,
        startPos: {r: 0, c: 0},
        path: [
            {r: 0, c: 0}, {r: 0, c: 1}, {r: 0, c: 2}, {r: 0, c: 3}, {r: 0, c: 4}, {r: 0, c: 5}, {r: 0, c: 6}, {r: 0, c: 7}, // Path to key 1
            {r: 1, c: 7}, {r: 2, c: 7}, {r: 3, c: 7}, {r: 4, c: 7}, {r: 5, c: 7}, {r: 6, c: 7}, {r: 7, c: 7}, // Path to key 2
            {r: 7, c: 6}, {r: 7, c: 5}, {r: 7, c: 4}, {r: 7, c: 3}, {r: 7, c: 2}, {r: 7, c: 1}, {r: 7, c: 0}, // Path to key 3
            {r: 6, c: 0}, {r: 5, c: 0}, {r: 4, c: 0}, {r: 4, c: 1}, {r: 3, c: 1}, {r: 3, c: 2}, 
            {r: 4, c: 2}, {r: 4, c: 3}, {r: 5, c: 3}, {r: 5, c: 4}, {r: 4, c: 4} // Path to door
        ],
        keyPos: [{r: 0, c: 7}, {r: 7, c: 7}, {r: 7, c: 0}],
        doorPos: {r: 4, c: 4}
    },
    // --- NEW LEVELS START HERE ---
    { // Level 7: 9x9, 2 keys (New)
        grid: 9,
        startPos: {r: 8, c: 4},
        path: [
            {r: 8, c: 4}, {r: 7, c: 4}, {r: 6, c: 4}, {r: 6, c: 5}, {r: 6, c: 6}, {r: 5, c: 6}, {r: 4, c: 6}, 
            {r: 4, c: 7}, {r: 4, c: 8}, {r: 3, c: 8}, {r: 2, c: 8}, {r: 1, c: 8}, // Path to key 1
            {r: 1, c: 7}, {r: 1, c: 6}, {r: 0, c: 6}, {r: 0, c: 5}, {r: 0, c: 4}, {r: 0, c: 3}, {r: 0, c: 2}, 
            {r: 1, c: 2}, {r: 2, c: 2}, {r: 2, c: 1}, {r: 2, c: 0}, // Path to key 2
            {r: 3, c: 0}, {r: 4, c: 0}, {r: 4, c: 1}, {r: 4, c: 2}, {r: 4, c: 3}, {r: 5, c: 3}, {r: 6, c: 3}, 
            {r: 7, c: 3}, {r: 8, c: 3}, {r: 8, c: 2}, {r: 8, c: 1}, {r: 8, c: 0} // Path to door
        ],
        keyPos: [{r: 1, c: 8}, {r: 2, c: 0}],
        doorPos: {r: 8, c: 0}
    },
    { // Level 8: 9x9, 3 keys (New)
        grid: 9,
        startPos: {r: 4, c: 4},
        path: [
            {r: 4, c: 4}, {r: 3, c: 4}, {r: 2, c: 4}, {r: 1, c: 4}, {r: 1, c: 3}, {r: 1, c: 2}, {r: 0, c: 2}, // Path to key 1
            {r: 1, c: 2}, {r: 1, c: 1}, {r: 2, c: 1}, {r: 3, c: 1}, {r: 4, c: 1}, {r: 4, c: 0}, // Path to key 2
            {r: 4, c: 1}, {r: 5, c: 1}, {r: 6, c: 1}, {r: 7, c: 1}, {r: 7, c: 2}, {r: 7, c: 3}, {r: 7, c: 4}, 
            {r: 7, c: 5}, {r: 7, c: 6}, {r: 7, c: 7}, {r: 8, c: 7}, // Path to key 3
            {r: 7, c: 7}, {r: 6, c: 7}, {r: 5, c: 7}, {r: 4, c: 7}, {r: 3, c: 7}, {r: 2, c: 7}, {r: 1, c: 7}, 
            {r: 1, c: 8}, {r: 2, c: 8}, {r: 3, c: 8}, {r: 4, c: 8}, {r: 5, c: 8}, {r: 6, c: 8}, {r: 7, c: 8}, 
            {r: 8, c: 8} // Path to door
        ],
        keyPos: [{r: 0, c: 2}, {r: 4, c: 0}, {r: 8, c: 7}],
        doorPos: {r: 8, c: 8}
    },
    { // Level 9: 10x10, 2 keys (New)
        grid: 10,
        startPos: {r: 9, c: 0},
        path: [
            {r: 9, c: 0}, {r: 8, c: 0}, {r: 7, c: 0}, {r: 6, c: 0}, {r: 5, c: 0}, {r: 4, c: 0}, {r: 3, c: 0}, 
            {r: 2, c: 0}, {r: 1, c: 0}, {r: 0, c: 0}, // Path to key 1
            {r: 1, c: 0}, {r: 1, c: 1}, {r: 2, c: 1}, {r: 3, c: 1}, {r: 4, c: 1}, {r: 5, c: 1}, {r: 6, c: 1}, 
            {r: 7, c: 1}, {r: 8, c: 1}, {r: 9, c: 1}, // Path to key 2
            {r: 9, c: 2}, {r: 8, c: 2}, {r: 7, c: 2}, {r: 6, c: 2}, {r: 5, c: 2}, {r: 4, c: 2}, {r: 3, c: 2}, 
            {r: 2, c: 2}, {r: 1, c: 2}, {r: 0, c: 2}, {r: 0, c: 3}, {r: 1, c: 3}, {r: 2, c: 3}, {r: 3, c: 3}, 
            {r: 4, c: 3}, {r: 5, c: 3}, {r: 6, c: 3}, {r: 7, c: 3}, {r: 8, c: 3}, {r: 9, c: 3}, {r: 9, c: 4}, 
            {r: 8, c: 4}, {r: 7, c: 4}, {r: 6, c: 4}, {r: 5, c: 4}, {r: 4, c: 4}, {r: 3, c: 4}, {r: 2, c: 4}, 
            {r: 1, c: 4}, {r: 0, c: 4} // Path to door
        ],
        keyPos: [{r: 0, c: 0}, {r: 9, c: 1}],
        doorPos: {r: 0, c: 4}
    },
    { // Level 10: 10x10, 3 keys (New)
        grid: 10,
        startPos: {r: 5, c: 5},
        path: [
            {r: 5, c: 5}, {r: 4, c: 5}, {r: 3, c: 5}, {r: 2, c: 5}, {r: 1, c: 5}, {r: 0, c: 5}, // Path to key 1
            {r: 1, c: 5}, {r: 1, c: 4}, {r: 1, c: 3}, {r: 1, c: 2}, {r: 1, c: 1}, {r: 1, c: 0}, // Path to key 2
            {r: 1, c: 1}, {r: 2, c: 1}, {r: 3, c: 1}, {r: 4, c: 1}, {r: 5, c: 1}, {r: 6, c: 1}, {r: 7, c: 1}, 
            {r: 8, c: 1}, {r: 9, c: 1}, {r: 9, c: 2}, {r: 9, c: 3}, {r: 8, c: 3}, {r: 7, c: 3}, {r: 6, c: 3}, 
            {r: 5, c: 3}, {r: 4, c: 3}, {r: 4, c: 4}, {r: 3, c: 4}, {r: 2, c: 4}, {r: 2, c: 3}, {r: 2, c: 2}, 
            {r: 3, c: 2}, {r: 4, c: 2}, {r: 5, c: 2}, {r: 6, c: 2}, {r: 7, c: 2}, {r: 8, c: 2}, {r: 9, c: 0}, // Path to key 3
            {r: 8, c: 0}, {r: 7, c: 0}, {r: 6, c: 0}, {r: 5, c: 0}, {r: 4, c: 0}, {r: 3, c: 0}, {r: 2, c: 0}, {r: 0, c: 0}, // Path to door
        ],
        keyPos: [{r: 0, c: 5}, {r: 1, c: 0}, {r: 9, c: 0}],
        doorPos: {r: 0, c: 0}
    }
];

// Game State
let qNum = 0;
let time = 240;
let timer;
let currentLvl;
let playerPos;
let pathIdx; // Tracks how far along the 'currentLvl.path' array the player is
let keysHeld;
let gameActive = false; // Prevents clicks during reset/transition

// --- Game Logic ---

function startGame() {
    startBtn.classList.add('hidden');
    gridEl.classList.remove('hidden'); // Ensure grid is visible if hidden by endGame
    showAnswerBtn.classList.remove('hidden'); // --- NEW ---
    qNum = 0;
    loadLevel(qNum);
}

function loadLevel(levelIdx) {
    if (levelIdx >= levels.length) {
        endGame();
        return;
    }
    gameActive = false; // Pause game during load
    
    // Reset timer
    clearInterval(timer);
    time = 240;
    timeEl.textContent = '4:00';
    timer = setInterval(updateTimer, 1000);
    
    qNum = levelIdx;
    currentLvl = levels[qNum];
    keysHeld = 0;
    pathIdx = 0; // Crucial: Reset pathIdx for new level

    qNumEl.textContent = `${qNum + 1} / ${levels.length}`; // Updated to new total
    keysHeldEl.textContent = keysHeld;
    keysTotalEl.textContent = currentLvl.keyPos.length;
    fEl.textContent = 'Find the key(s), then go to the door. Click adjacent cells to move.';
    fEl.style.color = '#555';
    
    showAnswerBtn.classList.remove('hidden'); // --- NEW ---

    drawGrid();
    playerPos = currentLvl.startPos;
    getCell(playerPos.r, playerPos.c).classList.add('player');
    
    // Allow clicks after a short delay for grid to render
    setTimeout(() => gameActive = true, 500);
}

function drawGrid() {
    gridEl.innerHTML = '';
    
    // --- NEW: Adjust cell size for large grids ---
    let cellSizeClass = '';
    if (currentLvl.grid >= 8 && currentLvl.grid < 10) {
        cellSizeClass = 'small';
    } else if (currentLvl.grid >= 10) {
        cellSizeClass = 'tiny';
    }
    
    // Adjust grid container width based on cell size
    let gridWidth = currentLvl.grid * (cellSizeClass === 'tiny' ? 45 : (cellSizeClass === 'small' ? 50 : 60));
    gridEl.style.width = `${gridWidth}px`;
    gridEl.style.height = `${gridWidth}px`; // Make it square
    
    gridEl.style.gridTemplateColumns = `repeat(${currentLvl.grid}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${currentLvl.grid}, 1fr)`;
    
    for (let r = 0; r < currentLvl.grid; r++) {
        for (let c = 0; c < currentLvl.grid; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (cellSizeClass) {
                cell.classList.add(cellSizeClass); // Add small/tiny class
            }
            cell.dataset.r = r;
            cell.dataset.c = c;
            
            // Place icons
            if (currentLvl.keyPos.some(k => k.r === r && k.c === c)) {
                cell.innerHTML = '🔑';
            } else if (currentLvl.doorPos.r === r && currentLvl.doorPos.c === c) {
                cell.innerHTML = '🚪';
            }
            
            cell.addEventListener('click', () => handleCellClick(r, c));
            gridEl.appendChild(cell);
        }
    }
}

function resetPlayer() {
    gameActive = false; // Pause game during reset animation
    
    // Remove old player icon
    const oldP = document.querySelector('.player');
    if (oldP) oldP.classList.remove('player');
    
    // Reset state
    playerPos = currentLvl.startPos; // Player always starts at the defined startPos
    pathIdx = 0;
    keysHeld = 0;
    keysHeldEl.textContent = keysHeld;
    
    // Redraw icons (in case they were covered by player)
    currentLvl.keyPos.forEach(k => {
        const keyCell = getCell(k.r, k.c);
        if (keyCell && !keyCell.innerHTML) keyCell.innerHTML = '🔑'; // Only put key back
    });
    
    // Place new player icon
    getCell(playerPos.r, playerPos.c).classList.add('player');
    fEl.textContent = 'Wrong move! You were sent back to the start.';
    fEl.style.color = '#e74c3c';
    setTimeout(() => {
        fEl.textContent = 'Find the key(s), then go to the door. Click adjacent cells to move.';
        fEl.style.color = '#555';
        gameActive = true; // Resume game after reset animation
    }, 1500);
}

function handleCellClick(r, c) {
    if (!gameActive) return; // Ignore clicks if game is paused

    // 1. Check if click is adjacent
    const dr = Math.abs(r - playerPos.r);
    const dc = Math.abs(c - playerPos.c);
    if (dr + dc !== 1) {
        fEl.textContent = 'You must click an adjacent cell!';
        fEl.style.color = '#e74c3c';
        setTimeout(() => {
            fEl.textContent = 'Find the key(s), then go to the door. Click adjacent cells to move.';
            fEl.style.color = '#555';
        }, 1000);
        return; 
    }

    // 2. Check if it's the *next* step on the path
    const nextStep = currentLvl.path[pathIdx + 1];
    
    if (nextStep && nextStep.r === r && nextStep.c === c) {
        // --- CORRECT MOVE ---
        const oldCell = getCell(playerPos.r, playerPos.c);
        const newCell = getCell(r, c);
        
        // Green flash on borders
        flashBorder(oldCell, newCell, 'green');

        // Move player
        oldCell.classList.remove('player');
        newCell.classList.add('player');
        playerPos = {r, c};
        pathIdx++;
        
        // 3. Check for landing on a key
        const keyIdx = currentLvl.keyPos.findIndex(k => k.r === r && k.c === c);
        if (keyIdx > -1 && newCell.innerHTML === '🔑') { // Ensure key is still visible
            keysHeld++;
            keysHeldEl.textContent = keysHeld;
            newCell.innerHTML = ''; // Key "picked up" by clearing cell content
        }
        
        // 4. Check for landing on the door
        if (r === currentLvl.doorPos.r && c === currentLvl.doorPos.c) {
            if (keysHeld === currentLvl.keyPos.length) {
                // WIN!
                gameActive = false;
                clearInterval(timer);
                fEl.textContent = `Level ${qNum + 1} Cleared!`;
                fEl.style.color = '#2ecc71';
                setTimeout(() => loadLevel(qNum + 1), 1500);
            } else {
                // At door, but not all keys
                fEl.textContent = `You need all ${currentLvl.keyPos.length} key(s) to exit!`;
            }
        }

    } else {
        // --- WRONG MOVE ---
        flashBorder(getCell(playerPos.r, playerPos.c), getCell(r,c), 'red');
        resetPlayer();
    }
}

function endGame() {
    gameActive = false;
    clearInterval(timer);
    showAnswerBtn.classList.add('hidden'); // --- NEW ---
    gridEl.innerHTML = `<h2>Game Over!</h2><h3>You completed all ${levels.length} levels.</h3>`;
    fEl.textContent = 'Excellent practice!';
    startBtn.textContent = 'Play Again?';
    startBtn.classList.remove('hidden');
}

async function updateTimer() {
    time--;
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    timeEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    
    if (time <= 0) {
        clearInterval(timer);
        gameActive = false; // Disable further clicks
        fEl.textContent = 'Time out! Showing correct path...';
        fEl.style.color = '#e74c3c';
        await visualizePath(); // Show the path
        setTimeout(() => loadLevel(qNum), 3000); // Restart current level after path shown
    }
}

// --- NEW FUNCTION ---
async function handleShowAnswer() {
    if (!gameActive) return; // Don't run if already running
    
    gameActive = false;
    clearInterval(timer);
    fEl.textContent = 'Showing correct path...';
    fEl.style.color = '#f39c12'; // Orange
    
    await visualizePath();
    
    // Restart level after showing path
    setTimeout(() => loadLevel(qNum), 3000);
}

// --- Helper Functions ---
function getCell(r, c) {
    return document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
}

function flashBorder(currentCell, targetCell, color) {
    const r1 = parseInt(currentCell.dataset.r);
    const c1 = parseInt(currentCell.dataset.c);
    const r2 = parseInt(targetCell.dataset.r);
    const c2 = parseInt(targetCell.dataset.c);

    let currentBorderClass, targetBorderClass;

    if (r2 < r1) { // Moving Up
        currentBorderClass = `border-${color}-top`;
        targetBorderClass = `border-${color}-bottom`;
    } else if (r2 > r1) { // Moving Down
        currentBorderClass = `border-${color}-bottom`;
        targetBorderClass = `border-${color}-top`;
    } else if (c2 < c1) { // Moving Left
        currentBorderClass = `border-${color}-left`;
        targetBorderClass = `border-${color}-right`;
    } else { // Moving Right
        currentBorderClass = `border-${color}-right`;
        targetBorderClass = `border-${color}-left`;
    }
    
    if (currentCell) currentCell.classList.add(currentBorderClass);
    if (targetCell) targetCell.classList.add(targetBorderClass);

    setTimeout(() => {
        if (currentCell) currentCell.classList.remove(currentBorderClass);
        if (targetCell) targetCell.classList.remove(targetBorderClass);
    }, 300);
}

// --- Path Visualization ---
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function visualizePath() {
    // Clear current player and any picked up keys
    const oldP = document.querySelector('.player');
    if (oldP) oldP.classList.remove('player');
    currentLvl.keyPos.forEach(k => {
        const keyCell = getCell(k.r, k.c);
        if (keyCell && !keyCell.innerHTML) keyCell.innerHTML = '🔑'; // Put keys back
    });

    for (let i = 0; i < currentLvl.path.length; i++) {
        const step = currentLvl.path[i];
        const cell = getCell(step.r, step.c);
        if (!cell) continue; // Failsafe if path is invalid
        cell.classList.add('path-highlight');
        
        // For animation: briefly show player moving
        if (i > 0) {
            const prevStep = currentLvl.path[i-1];
            const prevCell = getCell(prevStep.r, prevStep.c);
            if (prevCell) prevCell.classList.remove('player'); // Move player from previous cell
        }
        cell.classList.add('player'); // Add player to current cell

        await delay(200); // Sped up for 10 levels
    }
    await delay(1000); // Keep path visible for a moment
    // Clear path highlights after visualization
    document.querySelectorAll('.path-highlight').forEach(cell => cell.classList.remove('path-highlight'));
    document.querySelector('.player')?.classList.remove('player'); // Clear final player
}


// Start Button Event
startBtn.addEventListener('click', startGame);
showAnswerBtn.addEventListener('click', handleShowAnswer); // --- NEW ---
