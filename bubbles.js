// DOM Elements
const timeEl = document.getElementById('time');
const qNumEl = document.getElementById('qNum');
const bCont = document.getElementById('bubbles-container');
const fEl = document.getElementById('feedback');
const startBtn = document.getElementById('start-btn');
const resultsEl = document.getElementById('results-container'); 

// Game State
let qNum = 1;
const totalQ = 25;
let sel = []; // Selected bubbles
let bubbles = []; // Current question's bubbles
let timer;
let time = 15;
let score = 0; 
let gameHistory = []; // Tracks all answers

// --- Game Logic ---

function startGame() {
    startBtn.classList.add('hidden');
    fEl.textContent = 'Select 3 bubbles in ascending order.';
    
    resultsEl.classList.add('hidden');
    resultsEl.innerHTML = '';
    bCont.classList.remove('hidden');
    
    qNum = 1;
    score = 0;
    gameHistory = []; 
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
        setTimeout(() => handleAnswer(false, 'timeout'), 1000); 
    }
}

function selectBubble(bEl, id) {
    if (sel.length >= 3 || time <= 0) return;

    const selIdx = sel.indexOf(id);

    if (selIdx > -1) {
        sel.splice(selIdx, 1);
        bEl.classList.remove('selected');
    } else {
        sel.push(id);
        bEl.classList.add('selected');
    }

    if (sel.length === 3) {
        clearInterval(timer);
        
        const selVals = sel.map(id => bubbles.find(b => b.id === id).val);
        const isCorrect = selVals[0] < selVals[1] && selVals[1] < selVals[2];
        
        if (isCorrect) {
            fEl.textContent = 'Correct!';
            fEl.style.color = '#2ecc71';
        } else {
            fEl.textContent = 'Incorrect.';
            fEl.style.color = '#e74c3c';
        }
        
        setTimeout(() => handleAnswer(isCorrect, 'answered'), 1000);
    }
}

function handleAnswer(isCorrect, status) {
    if (isCorrect) {
        score++;
    }
    
    let userSelection = sel.map(id => bubbles.find(b => b.id === id));
    gameHistory.push({
        qNum: qNum,
        bubbles: [...bubbles], 
        userSelection: userSelection,
        isCorrect: isCorrect,
        status: status
    });
    
    qNum++;
    fEl.textContent = 'Select 3 bubbles in ascending order.';
    fEl.style.color = '#555';
    nextQuestion();
}

function endGame() {
    // Hide game, show results
    bCont.classList.add('hidden');
    bCont.innerHTML = '';
    resultsEl.classList.remove('hidden');
    fEl.textContent = 'Review your performance below.';
    
    let resultsHTML = `
        <h2>Game Over!</h2>
        <h3>Your Score: ${score} / ${totalQ}</h3>
        <table>
            <thead>
                <tr>
                    <th>Q#</th>
                    <th>Your Answer</th>
                    <th>Correct Answer</th>
                    <th>Bubbles (and values)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (const result of gameHistory) {
        const rowClass = result.isCorrect ? 'result-correct' : 'result-incorrect';
        
        const allBubbles = result.bubbles
            .map(b => `<div>${b.text} = <strong>${b.val}</strong></div>`)
            .join('');
            
        const correctOrder = [...result.bubbles]
            .sort((a, b) => a.val - b.val)
            .map(b => b.text)
            .join(' <br> ');
            
        let yourOrder;
        if (result.status === 'timeout') {
            yourOrder = '<strong>TIME OUT</strong>';
        } else if (result.userSelection.length < 3) {
            yourOrder = '<strong>INCOMPLETE</strong>';
        } else {
            yourOrder = result.userSelection.map(b => b.text).join(' <br> ');
        }
        
        resultsHTML += `
            <tr class="${rowClass}">
                <td>${result.qNum}</td>
                <td>${yourOrder}</td>
                <td>${correctOrder}</td>
                <td>${allBubbles}</td>
            </tr>
        `;
    }
    
    resultsHTML += `</tbody></table>`;
    resultsEl.innerHTML = resultsHTML;
    
    startBtn.textContent = 'Play Again?';
    startBtn.classList.remove('hidden');
}

// --- Bubble Generation ---

// --- UPDATED: Difficulty Tuning ---
function generateBubbles(diff) {
    let b = [];
    let type1, type2, type3;

    // Difficulty scaling
    if (diff < 9) {
        type1 = 'int'; type2 = 'int'; type3 = 'int';
    } else if (diff < 17) {
        type1 = 'int'; type2 = 'dec'; type3 = 'int';
    } else {
        type1 = 'dec'; type2 = 'dec'; type3 = 'dec';
    }
    
    b = [genOp(type1), genOp(type2), genOp(type3)];

    const vals = b.map(x => x.val);
    
    // --- Difficulty Tuning Logic ---
    // 1. Ensure all values are unique
    if (new Set(vals).size !== 3) {
        return generateBubbles(diff); // Regenerate
    }
    
    vals.sort((a, b) => a - b);
    
    const minVal = vals[0];
    const midVal = vals[1];
    const maxVal = vals[2];
    
    const totalDiff = maxVal - minVal;
    const minGap = Math.min(midVal - minVal, maxVal - midVal);
    
    // 2. Check "cognitive spot" constraints
    const isIntGame = type1 === 'int' && type2 === 'int' && type3 === 'int';
    
    if (isIntGame) {
        if (totalDiff > 40 || totalDiff < 5 || minGap < 2) {
            // Too easy (diff > 40), too clustered (diff < 5), or two bubbles are too close (gap < 2)
            return generateBubbles(diff); // Regenerate
        }
    } else { // Decimal/mixed game
        if (totalDiff > 25 || totalDiff < 3 || minGap < 0.5) {
            // Same logic, but for decimals
            return generateBubbles(diff); // Regenerate
        }
    }
    // --- End Tuning ---
    
    // Assign IDs and sort by value (as before)
    b.forEach((x, i) => x.id = i);
    b.sort((a, b) => a.val - b.val);
    
    return b;
}


// --- UPDATED: Modulo operator is now division, and squares are added ---
function genOp(type) {
    const ops = ['+', '-', '*', '/'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1, n2, val, text;

    if (type === 'int') {
        n1 = randInt(1, 20);
        n2 = randInt(1, 20);
        
        if (op === '/') {
            n2 = n2 === 0 ? 1 : n2; 
            n1 = n1 * n2; 
        }
        if (op === '-') {
            if (n1 < n2) [n1, n2] = [n2, n1];
            if(n1 === n2) n1 += 1; 
        }

    } else { // type === 'dec'
        n1 = randDec(1, 10);
        n2 = randDec(1, 10);
        
        if (op === '/') n2 = randDec(2, 10); 
        if (op === '-') {
            if (n1 < n2) [n1, n2] = [n2, n1];
            if(n1 === n2) n1 += 0.1; 
        }
    }

    switch (op) {
        case '+': val = n1 + n2; text = `${n1} + ${n2}`; break;
        case '-': val = n1 - n2; text = `${n1} - ${n2}`; break;
        case '*': val = n1 * n2; text = `${n1} x ${n2}`; break;
        case '/': val = n1 / n2; text = `${n1} / ${n2}`; break;
    }
    
    // --- MODIFICATION HERE ---
    // Add 'division as %' and squares for variety
    if (type === 'int' && Math.random() > 0.7) {
        // 70% chance for division, 30% for square
        if (Math.random() > 0.3) {
            // User wants 6%2 = 3 (division)
            n2 = randInt(2, 10); // Divisor
            let m = randInt(2, 10); // Multiplier
            n1 = n2 * m;
            val = n1 / n2;
            text = `${n1} % ${n2}`; // Display as %
        } else {
            // Add squares
            n1 = randInt(3, 12); // e.g., 3*3 to 12*12
            val = n1 * n1;
            text = `${n1}²`;
        }

    } else if (type === 'dec' && Math.random() > 0.7) {
        // Mix in an int * dec
        n1 = randInt(2, 10);
        n2 = randDec(2, 10);
        val = n1 * n2;
        text = `${n1} x ${n2}`;
    }
    // --- END MODIFICATION ---

    return { text: text, val: parseFloat(val.toFixed(2)) };
}


function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randDec(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

startBtn.addEventListener('click', startGame);
