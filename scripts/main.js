import { truths, dares } from './data.js';

// DOM elements
const display = document.getElementById('display');
const truthBtn = document.getElementById('truth-btn');
const dareBtn = document.getElementById('dare-btn');
const randomBtn = document.getElementById('random-btn');
const nsfwToggle = document.getElementById('nsfw-toggle');
const clickSound = document.getElementById('clickSound');

// Play sound function
function playSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Sound playback prevented:", e));
}

// Show question/challenge function
function showQuestion(type) {
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
        question = allTruths[Math.floor(Math.random() * allTruths.length)];
        display.innerHTML = `<span class="type-label truth">TRUTH:</span> ${question}`;
        display.classList.add('truth');
    } else {
        const allDares = [
            ...dares.sfw,
            ...(includeNSFW ? dares.nsfw : [])
        ];
        question = allDares[Math.floor(Math.random() * allDares.length)];
        display.innerHTML = `<span class="type-label dare">DARE:</span> ${question}`;
        display.classList.add('dare');
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

// Add click animation to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 300);
    });
});