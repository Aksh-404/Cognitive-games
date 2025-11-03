// DOM Elements
const timeEl = document.getElementById('time');
const qNumEl = document.getElementById('qNum');
const keysHeldEl = document.getElementById('keys-held');
const keysTotalEl = document.getElementById('keys-total');
const gridEl = document.getElementById('grid-container');
const fEl = document.getElementById('feedback');
const startBtn = document.getElementById('start-btn');

// --- Level Definitions ---
// path: The one and only correct sequence of coordinates
const levels = [
    { // Level 1: 5x5, 1 key
        grid: 5,
        startPos: {r: 4, c: 2}, // Explicit start position
        path: [
            {r: 4, c: 2}, {r: 3, c: 2}, {r: 3, c: 1}, {r: 2, c: 1}, {r: 1, c: 1}, // Path to key
            {r: 1, c: 2}, {r: 1, c: 3}, {r: 0, c: 3}  // Path to door
        ],
        keyPos: [{r: 1, c: 1}],
        doorPos: {r: 0, c: 3}
    },
    { // Level 2: 6x6, 1 key
        grid: 6,
        startPos: {r: 5, c: 0},
        path: [
            {r: 5, c: 0}, {r: 4, c: 0}, {r: 3, c: 0}, {r: 3, c: 1}, {r: 3, c: 2}, {r: 2, c: 2}, // Path to key
            {r: 1, c: 2}, {r: 1, c: 3}, {r: 1, c: 4}, {r: 2, c: 4}, {r: 2, c: 5}, {r: 1, c: 5}, {r: 0, c: 5} // Path to door
        ],
        keyPos: [{r: 2, c: 2}],
        doorPos: {r: 0, c: 5}
    },
    { // Level 3: 7x7, 2 keys
        grid: 7,
        startPos: {r: 6, c: 3},
        path: [
            {r: 6, c: 3}, {r: 5, c: 3}, {r: 5, c: 2}, {r: 4, c: 2}, {r: 3, c: 2}, {r: 3, c: 1}, {r: 2, c: 1}, // Path to key 1
            {r: 1, c: 1}, {r: 1, c: 2}, {r: 1, c: 3}, {r: 1, c: 4}, {r: 1, c: 5}, // Path to key 2
            {r: 2, c: 5}, {r: 3, c: 5}, {r: 3, c: 6}, {r: 2, c: 6}, {r: 1, c: 6}, {r: 0, c: 6} // Path to door
        ],
        keyPos: [{r: 2, c: 1}, {r: 1, c: 5}],
        doorPos: {r: 0, c: 6}
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

    qNumEl.textContent = qNum + 1;
    keysHeldEl.textContent = keysHeld;
    keysTotalEl.textContent = currentLvl.keyPos.length;
    fEl.textContent = 'Find the key(s), then go to the door. Click adjacent cells to move.';
    fEl.style.color = '#555';

    drawGrid();
    playerPos = currentLvl.startPos;
    getCell(playerPos.r, playerPos.c).classList.add('player');
    
    // Allow clicks after a short delay for grid to render
    setTimeout(() => gameActive = true, 500);
}

function drawGrid() {
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = `repeat(${currentLvl.grid}, 60px)`;
    gridEl.style.gridTemplateRows = `repeat(${currentLvl.grid}, 60px)`;
    
    for (let r = 0; r < currentLvl.grid; r++) {
        for (let c = 0; c < currentLvl.grid; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
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
        if (!keyCell.innerHTML) keyCell.innerHTML = '🔑'; // Only put key back if it was picked up
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
    gridEl.innerHTML = `<h2>Game Over!</h2><h3>You completed all 3 levels.</h3>`;
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

    currentCell.classList.add(currentBorderClass);
    targetCell.classList.add(targetBorderClass);

    setTimeout(() => {
        currentCell.classList.remove(currentBorderClass);
        targetCell.classList.remove(targetBorderClass);
    }, 300);
}

// --- NEW: Path Visualization ---
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function visualizePath() {
    // Clear current player and any picked up keys
    const oldP = document.querySelector('.player');
    if (oldP) oldP.classList.remove('player');
    currentLvl.keyPos.forEach(k => {
        const keyCell = getCell(k.r, k.c);
        if (!keyCell.innerHTML) keyCell.innerHTML = '🔑'; // Put keys back for visualization
    });

    for (let i = 0; i < currentLvl.path.length; i++) {
        const step = currentLvl.path[i];
        const cell = getCell(step.r, step.c);
        cell.classList.add('path-highlight');
        
        // For animation: briefly show player moving
        if (i > 0) {
            const prevStep = currentLvl.path[i-1];
            const prevCell = getCell(prevStep.r, prevStep.c);
            prevCell.classList.remove('player'); // Move player from previous cell
        }
        cell.classList.add('player'); // Add player to current cell

        await delay(300); // Pause for effect

        // Remove player class after delay to animate movement
        if (i < currentLvl.path.length - 1) { // Don't remove player from final door
             cell.classList.remove('player');
        } else {
            // Keep player on door, if all keys collected
            if (currentLvl.keyPos.every(k => !getCell(k.r, k.c).innerHTML)) {
                 getCell(currentLvl.doorPos.r, currentLvl.doorPos.c).classList.add('player');
            }
        }
    }
    await delay(1000); // Keep path visible for a moment
    // Clear path highlights after visualization
    document.querySelectorAll('.path-highlight').forEach(cell => cell.classList.remove('path-highlight'));
    document.querySelector('.player').classList.remove('player'); // Clear final player
}


// Start Button Event
startBtn.addEventListener('click', startGame);