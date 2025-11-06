// DOM Elements
const timeEl = document.getElementById('time');
const qNumEl = document.getElementById('qNum');
const keysHeldEl = document.getElementById('keys-held');
const keysTotalEl = document.getElementById('keys-total');
const gridEl = document.getElementById('grid-container');
const fEl = document.getElementById('feedback');
const startBtn = document.getElementById('start-btn');
const showAnswerBtn = document.getElementById('show-answer-btn');

// --- UPDATED: 10 Levels, only 6x6, 7x7, 8x8 ---
const levels = [
    { // Level 1: 6x6, 1 key (Original 2)
        grid: 6,
        startPos: {r: 5, c: 0},
        path: [
            {r: 5, c: 0}, {r: 4, c: 0}, {r: 3, c: 0}, {r: 3, c: 1}, {r: 3, c: 2}, {r: 2, c: 2}, // Path to key
            {r: 1, c: 2}, {r: 1, c: 3}, {r: 1, c: 4}, {r: 2, c: 4}, {r: 2, c: 5}, {r: 1, c: 5}, {r: 0, c: 5} // Path to door
        ],
        keyPos: [{r: 2, c: 2}],
        doorPos: {r: 0, c: 5}
    },
    { // Level 2: 6x6, 1 key (New)
        grid: 6,
        startPos: {r: 3, c: 3},
        path: [
            {r: 3, c: 3}, {r: 2, c: 3}, {r: 1, c: 3}, {r: 1, c: 2}, {r: 1, c: 1}, {r: 0, c: 1}, // Path to key
            {r: 1, c: 1}, {r: 2, c: 1}, {r: 3, c: 1}, {r: 4, c: 1}, {r: 4, c: 0}, // Path to door
        ],
        keyPos: [{r: 0, c: 1}],
        doorPos: {r: 4, c: 0}
    },
    { // Level 3: 7x7, 1 key (Original 4)
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
    { // Level 4: 7x7, 2 keys (Original 3)
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
    { // Level 5: 7x7, 2 keys (New)
        grid: 7,
        startPos: {r: 0, c: 3},
        path: [
            {r: 0, c: 3}, {r: 1, c: 3}, {r: 1, c: 2}, {r: 1, c: 1}, {r: 2, c: 1}, {r: 3, c: 1}, {r: 4, c: 1}, {r: 5, c: 1}, {r: 6, c: 1}, // Path to key 1
            {r: 6, c: 2}, {r: 6, c: 3}, {r: 5, c: 3}, {r: 4, c: 3}, {r: 3, c: 3}, {r: 3, c: 4}, {r: 3, c: 5}, {r: 4, c: 5}, {r: 5, c: 5}, {r: 6, c: 5}, // Path to key 2
            {r: 5, c: 5}, {r: 5, c: 6}, {r: 4, c: 6}, {r: 3, c: 6}, {r: 2, c: 6}, {r: 1, c: 6}, {r: 0, c: 6}, // Path to door
        ],
        keyPos: [{r: 6, c: 1}, {r: 6, c: 5}],
        doorPos: {r: 0, c: 6}
    },
    { // Level 6: 8x8, 1 key (New)
        grid: 8,
        startPos: {r: 7, c: 7},
        path: [
            {r: 7, c: 7}, {r: 6, c: 7}, {r: 6, c: 6}, {r: 6, c: 5}, {r: 5, c: 5}, {r: 4, c: 5}, {r: 3, c: 5}, {r: 3, c: 4}, {r: 3, c: 3}, 
            {r: 2, c: 3}, {r: 1, c: 3}, {r: 0, c: 3}, // Path to key
            {r: 1, c: 3}, {r: 1, c: 2}, {r: 1, c: 1}, {r: 1, c: 0}, {r: 2, c: 0}, {r: 3, c: 0}, {r: 4, c: 0}, // Path to door
        ],
        keyPos: [{r: 0, c: 3}],
        doorPos: {r: 4, c: 0}
    },
    { // Level 7: 8x8, 2 keys (Original 5)
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
    { // Level 8: 8x8, 2 keys (New)
        grid: 8,
        startPos: {r: 0, c: 0},
        path: [
            {r: 0, c: 0}, {r: 1, c: 0}, {r: 2, c: 0}, {r: 3, c: 0}, {r: 3, c: 1}, {r: 3, c: 2}, {r: 2, c: 2}, {r: 1, c: 2}, {r: 0, c: 2}, // Path to key 1
            {r: 1, c: 2}, {r: 1, c: 3}, {r: 1, c: 4}, {r: 1, c: 5}, {r: 0, c: 5}, // Path to key 2
            {r: 1, c: 5}, {r: 2, c: 5}, {r: 3, c: 5}, {r: 4, c: 5}, {r: 5, c: 5}, {r: 6, c: 5}, {r: 7, c: 5}, 
            {r: 7, c: 6}, {r: 7, c: 7}, {r: 6, c: 7}, {r: 5, c: 7}, {r: 4, c: 7}, // Path to door
        ],
        keyPos: [{r: 0, c: 2}, {r: 0, c: 5}],
        doorPos: {r: 4, c: 7}
    },
    { // Level 9: 8x8, 3 keys (Original 6)
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
    { // Level 10: 8x8, 3 keys (New)
        grid: 8,
        startPos: {r: 4, c: 3},
        path: [
            {r: 4, c: 3}, {r: 4, c: 2}, {r: 4, c: 1}, {r: 5, c: 1}, {r: 6, c: 1}, {r: 7, c: 1}, {r: 7, c: 0}, // Path to key 1
            {r: 7, c: 1}, {r: 6, c: 1}, {r: 6, c: 2}, {r: 6, c: 3}, {r: 6, c: 4}, {r: 7, c: 4}, {r: 7, c: 5}, {r: 7, c: 6}, {r: 7, c: 7}, // Path to key 2
            {r: 7, c: 6}, {r: 6, c: 6}, {r: 5, c: 6}, {r: 4, c: 6}, {r: 3, c: 6}, {r: 2, c: 6}, {r: 1, c: 6}, {r: 0, c: 6}, // Path to key 3
            {r: 1, c: 6}, {r: 1, c: 5}, {r: 1, c: 4}, {r: 1, c: 3}, {r: 1, c: 2}, {r: 0, c: 2}, // Path to door
        ],
        keyPos: [{r: 7, c: 0}, {r: 7, c: 7}, {r: 0, c: 6}],
        doorPos: {r: 0, c: 2}
    }
];
// --- END OF LEVEL DEFINITIONS ---

// Game State
let qNum = 0;
let time = 240;
let timer;
let currentLvl;
let playerPos;
let pathIdx; 
let keysHeld;
let gameActive = false; 

// --- Game Logic ---

function startGame() {
    startBtn.classList.add('hidden');
    gridEl.classList.remove('hidden'); 
    showAnswerBtn.classList.remove('hidden');
    qNum = 0;
    loadLevel(qNum);
}

function loadLevel(levelIdx) {
    if (levelIdx >= levels.length) {
        endGame();
        return;
    }
    gameActive = false; 
    
    // --- NEW: Clear visited path from previous level ---
    clearVisitedPath();
    
    clearInterval(timer);
    time = 240;
    timeEl.textContent = '4:00';
    timer = setInterval(updateTimer, 1000);
    
    qNum = levelIdx;
    currentLvl = levels[qNum];
    keysHeld = 0;
    pathIdx = 0; 

    qNumEl.textContent = `${qNum + 1} / ${levels.length}`;
    keysHeldEl.textContent = keysHeld;
    keysTotalEl.textContent = currentLvl.keyPos.length;
    fEl.textContent = 'Find the key(s), then go to the door. Click adjacent cells to move.';
    fEl.style.color = '#555';
    
    showAnswerBtn.classList.remove('hidden');

    drawGrid();
    playerPos = currentLvl.startPos;
    getCell(playerPos.r, playerPos.c).classList.add('player');
    
    setTimeout(() => gameActive = true, 500);
}

// --- UPDATED: drawGrid for new tile size ---
function drawGrid() {
    gridEl.innerHTML = '';
    
    const tileSize = 120; // New tile size
    let gridWidth = currentLvl.grid * tileSize;
    
    // Set container width
    const gameContainer = document.getElementById('game-container');
    // Add padding/border offset
    gameContainer.style.maxWidth = `${gridWidth + 60}px`; 
    
    gridEl.style.width = `${gridWidth}px`;
    gridEl.style.height = `${gridWidth}px`;
    
    gridEl.style.gridTemplateColumns = `repeat(${currentLvl.grid}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${currentLvl.grid}, 1fr)`;
    
    for (let r = 0; r < currentLvl.grid; r++) {
        for (let c = 0; c < currentLvl.grid; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.r = r;
            cell.dataset.c = c;
            
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

// --- UPDATED: resetPlayer to clear path ---
function resetPlayer() {
    gameActive = false; 

    // --- NEW: Clear the visited path ---
    clearVisitedPath();
    
    const oldP = document.querySelector('.player');
    if (oldP) oldP.classList.remove('player');
    
    playerPos = currentLvl.startPos; 
    pathIdx = 0;
    keysHeld = 0;
    keysHeldEl.textContent = keysHeld;
    
    currentLvl.keyPos.forEach(k => {
        const keyCell = getCell(k.r, k.c);
        if (keyCell && !keyCell.innerHTML) keyCell.innerHTML = '🔑'; 
    });
    
    getCell(playerPos.r, playerPos.c).classList.add('player');
    fEl.textContent = 'Wrong move! You were sent back to the start.';
    fEl.style.color = '#e74c3c';
    setTimeout(() => {
        fEl.textContent = 'Find the key(s), then go to the door. Click adjacent cells to move.';
        fEl.style.color = '#555';
        gameActive = true; 
    }, 1500);
}

// --- UPDATED: handleCellClick to add visited path ---
function handleCellClick(r, c) {
    if (!gameActive) return; 

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

    const nextStep = currentLvl.path[pathIdx + 1];
    
    if (nextStep && nextStep.r === r && nextStep.c === c) {
        // --- CORRECT MOVE ---
        const oldCell = getCell(playerPos.r, playerPos.c);
        const newCell = getCell(r, c);
        
        flashBorder(oldCell, newCell, 'green');

        oldCell.classList.remove('player');
        // --- NEW: Add visited class to the cell you just left ---
        oldCell.classList.add('visited');
        
        newCell.classList.add('player');
        playerPos = {r, c};
        pathIdx++;
        
        const keyIdx = currentLvl.keyPos.findIndex(k => k.r === r && k.c === c);
        if (keyIdx > -1 && newCell.innerHTML === '🔑') { 
            keysHeld++;
            keysHeldEl.textContent = keysHeld;
            newCell.innerHTML = ''; 
        }
        
        if (r === currentLvl.doorPos.r && c === currentLvl.doorPos.c) {
            if (keysHeld === currentLvl.keyPos.length) {
                // WIN!
                gameActive = false;
                clearInterval(timer);
                fEl.textContent = `Level ${qNum + 1} Cleared!`;
                fEl.style.color = '#2ecc71';
                setTimeout(() => loadLevel(qNum + 1), 1500);
            } else {
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
    showAnswerBtn.classList.add('hidden'); 
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
        gameActive = false; 
        fEl.textContent = 'Time out! Showing correct path...';
        fEl.style.color = '#e74c3c';
        await visualizePath(); 
        setTimeout(() => loadLevel(qNum), 3000); 
    }
}

async function handleShowAnswer() {
    if (!gameActive) return; 
    
    gameActive = false;
    clearInterval(timer);
    fEl.textContent = 'Showing correct path...';
    fEl.style.color = '#f39c12'; 
    
    await visualizePath();
    
    setTimeout(() => loadLevel(qNum), 3000);
}

// --- Helper Functions ---

// --- NEW: Helper to clear visited path ---
function clearVisitedPath() {
    const visitedCells = document.querySelectorAll('.cell.visited');
    visitedCells.forEach(cell => {
        cell.classList.remove('visited');
    });
}

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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- UPDATED: visualizePath to clear visited path first ---
async function visualizePath() {
    // --- NEW: Clear user's path before showing answer ---
    clearVisitedPath();
    
    const oldP = document.querySelector('.player');
    if (oldP) oldP.classList.remove('player');
    currentLvl.keyPos.forEach(k => {
        const keyCell = getCell(k.r, k.c);
        if (keyCell && !keyCell.innerHTML) keyCell.innerHTML = '🔑'; // Put keys back
    });

    for (let i = 0; i < currentLvl.path.length; i++) {
        const step = currentLvl.path[i];
        const cell = getCell(step.r, step.c);
        if (!cell) continue; 
        cell.classList.add('path-highlight');
        
        if (i > 0) {
            const prevStep = currentLvl.path[i-1];
            const prevCell = getCell(prevStep.r, prevStep.c);
            if (prevCell) prevCell.classList.remove('player'); 
        }
        cell.classList.add('player'); 

        await delay(200); 
    }
    await delay(1000); 
    
    document.querySelectorAll('.path-highlight').forEach(cell => cell.classList.remove('path-highlight'));
    document.querySelector('.player')?.classList.remove('player'); 
}

// Start Button Event
startBtn.addEventListener('click', startGame);
showAnswerBtn.addEventListener('click', handleShowAnswer);
