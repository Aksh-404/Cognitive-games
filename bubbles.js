// DOM Elements
const timeEl = document.getElementById('time');
const qNumEl = document.getElementById('qNum');
const bCont = document.getElementById('bubbles-container');
const fEl = document.getElementById('feedback');
const startBtn = document.getElementById('start-btn');

// Game State
let qNum = 1;
const totalQ = 25;
let sel = []; // Selected bubbles
let bubbles = []; // Current question's bubbles
let timer;
let time = 15;
let score = 0; // Score tracker

// --- Game Logic ---

function startGame() {
    startBtn.classList.add('hidden');
    fEl.textContent = 'Select 3 bubbles in ascending order.';
    qNum = 1;
    score = 0; // Reset score on start
    nextQuestion();
}

function nextQuestion() {
    // Reset
    clearInterval(timer);
    time = 15;
    timeEl.textContent = time;
    sel = [];
    bCont.innerHTML = '';
    
    if (qNum > totalQ) {
        endGame();
        return;
    }
    
    qNumEl.textContent = qNum;
    bubbles = generateBubbles(qNum);
    
    // Shuffle bubbles for display
    let shufB = [...bubbles].sort(() => Math.random() - 0.5);
    
    shufB.forEach((b, idx) => {
        const bEl = document.createElement('div');
        bEl.classList.add('bubble');
        bEl.textContent = b.text;
        bEl.dataset.id = b.id; // Store original id
        bEl.addEventListener('click', () => selectBubble(bEl, b.id));
        bCont.appendChild(bEl);
    });
    
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    time--;
    timeEl.textContent = time;
    if (time <= 0) {
        clearInterval(timer);
        fEl.textContent = 'Time out! Moving to next...';
        fEl.style.color = '#e74c3c';
        setTimeout(() => handleAnswer(false), 1000); // Pass false for incorrect
    }
}

function selectBubble(bEl, id) {
    // Prevent selection if 3 are already chosen or time is up
    if (sel.length >= 3 || time <= 0) return;

    const selIdx = sel.indexOf(id);

    if (selIdx > -1) {
        // Deselect
        sel.splice(selIdx, 1);
        bEl.classList.remove('selected');
    } else {
        // Select
        sel.push(id);
        bEl.classList.add('selected');
    }

    // Check answer if 3 are selected
    if (sel.length === 3) {
        clearInterval(timer);
        
        // Find the values of the selected bubbles
        const selVals = sel.map(id => bubbles.find(b => b.id === id).val);
        
        // Check if they are in ascending order
        const isCorrect = selVals[0] < selVals[1] && selVals[1] < selVals[2];
        
        if (isCorrect) {
            fEl.textContent = 'Correct!';
            fEl.style.color = '#2ecc71';
        } else {
            fEl.textContent = 'Incorrect.';
            fEl.style.color = '#e74c3c';
        }
        
        setTimeout(() => handleAnswer(isCorrect), 1000);
    }
}

function handleAnswer(isCorrect) {
    if (isCorrect) {
        score++; // Increment score if correct
    }
    
    qNum++;
    fEl.textContent = 'Select 3 bubbles in ascending order.';
    fEl.style.color = '#555';
    nextQuestion();
}

function endGame() {
    // Show final score
    bCont.innerHTML = `<h2>Game Over!</h2><h3>Your Score: ${score} / ${totalQ}</h3>`;
    fEl.textContent = `Well done! Click "Play Again?" to improve your score.`;
    startBtn.textContent = 'Play Again?';
    startBtn.classList.remove('hidden');
}

// --- Bubble Generation ---

function generateBubbles(diff) {
    let b = [];
    
    // Difficulty scaling: 1-8 (int), 9-16 (mixed), 17-25 (decimals)
    if (diff < 9) {
        // Easy: Integer operations
        b = [genOp('int'), genOp('int'), genOp('int')];
    } else if (diff < 17) {
        // Medium: Mix of int and decimal
        b = [genOp('int'), genOp('dec'), genOp('int')];
    } else {
        // Hard: Decimal operations
        b = [genOp('dec'), genOp('dec'), genOp('dec')];
    }

    // Ensure all values are unique
    const vals = b.map(x => x.val);
    if (new Set(vals).size !== 3) {
        // If not unique, regenerate
        return generateBubbles(diff);
    }
    
    // Assign IDs and sort by value
    b.forEach((x, i) => x.id = i);
    
    // The correct answer is always 0, 1, 2 in order of value
    b.sort((a, b) => a.val - b.val);
    
    return b;
}

function genOp(type) {
    const ops = ['+', '-', '*', '/'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1, n2, val, text;

    if (type === 'int') {
        n1 = randInt(1, 20);
        n2 = randInt(1, 20);
        
        if (op === '/') {
            // Ensure whole number division
            n2 = n2 === 0 ? 1 : n2; // Avoid div by zero
            n1 = n1 * n2; // Make n1 divisible by n2
        }
        if (op === '-') {
            // Ensure positive result
            if (n1 < n2) [n1, n2] = [n2, n1];
            // --- THIS IS THE FIX ---
            // The stray underscore from the previous version is gone.
            if(n1 === n2) n1 += 1; // Avoid 0 result
        }

    } else { // type === 'dec'
        n1 = randDec(1, 10);
        n2 = randDec(1, 10);
        
        if (op === '/') n2 = randDec(2, 10); // Avoid division by small num
        if (op === '-') {
            if (n1 < n2) [n1, n2] = [n2, n1];
            if(n1 === n2) n1 += 0.1; // Avoid 0 result
        }
    }

    switch (op) {
        case '+': val = n1 + n2; text = `${n1} + ${n2}`; break;
        case '-': val = n1 - n2; text = `${n1} - ${n2}`; break;
        case '*': val = n1 * n2; text = `${n1} x ${n2}`; break;
        case '/': val = n1 / n2; text = `${n1} / ${n2}`; break;
    }
    
    // Add modulo and squares for variety
    if (type === 'int' && Math.random() > 0.7) {
        n1 = randInt(10, 30);
        n2 = randInt(2, 10);
        val = n1 % n2;
        text = `${n1} % ${n2}`;
    } else if (type === 'dec' && Math.random() > 0.7) {
        // Mix in an int * dec
        n1 = randInt(2, 10);
        n2 = randDec(2, 10);
        val = n1 * n2;
        text = `${n1} x ${n2}`;
    }

    return { text: text, val: parseFloat(val.toFixed(2)) };
}

// Helper functions
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randDec(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

// Start Button Event
startBtn.addEventListener('click', startGame);