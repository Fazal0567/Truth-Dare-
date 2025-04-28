import { truths, dares } from './data.js';

// Game state
let players = [];
let currentPlayerIndex = 0;

// DOM elements
const display = document.getElementById('display');
const questionDisplay = document.getElementById('question-display');
const currentPlayerDisplay = document.getElementById('current-player');
const truthBtn = document.getElementById('truth-btn');
const dareBtn = document.getElementById('dare-btn');
const randomBtn = document.getElementById('random-btn');
const nsfwToggle = document.getElementById('nsfw-toggle');
const clickSound = document.getElementById('clickSound');
const playerNameInput = document.getElementById('player-name');
const addPlayerBtn = document.getElementById('add-player-btn');
const playersList = document.getElementById('players');
const playerCount = document.getElementById('player-count');

// Initialize game
function initGame() {
    updatePlayerDisplay();
    updatePlayerList();
}

// Add sound effect
function playSound() {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => console.log('Sound play failed:', err));
    }
}

// Add player
function addPlayer(name) {
    if (name.trim() === '') return;
    
    players.push({
        name: name.trim(),
        score: 0
    });
    
    playerNameInput.value = '';
    updatePlayerList();
    updatePlayerDisplay();
    playSound();
}

// Remove player
function removePlayer(index) {
    players.splice(index, 1);
    if (currentPlayerIndex >= players.length) {
        currentPlayerIndex = 0;
    }
    updatePlayerList();
    updatePlayerDisplay();
}

// Update player list UI
function updatePlayerList() {
    playersList.innerHTML = '';
    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${player.name}
            <button class="remove-player" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;
        playersList.appendChild(li);
    });
    
    playerCount.textContent = players.length;
}

// Add event delegation for remove buttons
playersList.addEventListener('click', (e) => {
    if (e.target.closest('.remove-player')) {
        const index = parseInt(e.target.closest('.remove-player').dataset.index);
        removePlayer(index);
    }
});

// Update current player display
function updatePlayerDisplay() {
    if (players.length === 0) {
        currentPlayerDisplay.textContent = 'No players yet';
        currentPlayerDisplay.style.color = '#666';
    } else {
        currentPlayerDisplay.textContent = `${players[currentPlayerIndex].name}'s turn`;
        currentPlayerDisplay.style.color = '';
    }
}

// Move to next player
function nextPlayer() {
    if (players.length === 0) return;
    
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updatePlayerDisplay();
}

// Show question/challenge
function showQuestion(type) {
    if (players.length === 0) {
        questionDisplay.textContent = 'Please add players first!';
        return;
    }
    
    try {
        playSound();
        
        let question;
        const includeNSFW = nsfwToggle.checked;
        
        // Reset display classes
        display.className = 'display';
        
        if (type === 'truth') {
            const allTruths = [
                ...truths.sfw,
                ...(includeNSFW ? truths.nsfw : [])
            ];
            if (allTruths.length === 0) throw new Error('No truth questions available');
            question = allTruths[Math.floor(Math.random() * allTruths.length)];
            questionDisplay.innerHTML = `<span class="type-label truth">TRUTH: </span> ${question}`;
            display.classList.add('truth');
        } else {
            const allDares = [
                ...dares.sfw,
                ...(includeNSFW ? dares.nsfw : [])
            ];
            if (allDares.length === 0) throw new Error('No dare questions available');
            question = allDares[Math.floor(Math.random() * allDares.length)];
            questionDisplay.innerHTML = `<span class="type-label dare">DARE: </span> ${question}`;
            display.classList.add('dare');
        }
        
        setTimeout(nextPlayer, 3000);
    } catch (error) {
        console.error('Game error:', error);
        questionDisplay.textContent = 'Something went wrong. Please try again.';
    }
}

// Event listeners
truthBtn.addEventListener('click', () => showQuestion('truth'));
dareBtn.addEventListener('click', () => showQuestion('dare'));
randomBtn.addEventListener('click', () => {
    const randomChoice = Math.random() < 0.5 ? 'truth' : 'dare';
    showQuestion(randomChoice);
    display.classList.add('random');
});

addPlayerBtn.addEventListener('click', () => addPlayer(playerNameInput.value));
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPlayer(playerNameInput.value);
    }
});

// Add click animation to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 300);
    });
});

// Initialize game
initGame();