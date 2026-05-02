// html elements
let title = document.getElementById("title");
let playercountInput = document.getElementById("player-count");
let startBtn = document.getElementById("start-button");
let wordBtn = document.getElementById("word-button");
let newGameBtn = document.getElementById("new-game-button");
let mainMenu = document.getElementById("main-menu");
let chameleonView = document.getElementById("chameleon-view");
let playerIdx = document.getElementById("playerIdx");
let passBtn = document.getElementById("pass-button");

const ANIMAL_EMOJIS = ['🦊', '🐨', '🦁', '🐸', '🐺', '🦋', '🦜', '🦄'];

let secretWord = "";
let chameleonIndex = -1;
let holdActive = false;
let playerCount = 0;
let currentPlayer = 0;
let playerEmojis = [];

let data = {};
let currentCollections = [];
let selected = new Set();
let collectionButtons = [];

let words = [];

if (localStorage.getItem("playerCount")) {
    playercountInput.value = localStorage.getItem("playerCount");
}

newGameBtn.addEventListener("click", () => {
    chameleonView.style.opacity = "0";
    newGameBtn.style.opacity = "0";
    newGameBtn.style.top = "-50px";

    setTimeout(() => {
        chameleonView.style.display = "none";
        mainMenu.style.opacity = "0";
        mainMenu.style.display = "flex";
        mainMenu.offsetHeight;
        mainMenu.style.opacity = "1";
    }, 300);
    title.style.opacity = "1";
    resetGame();
});

startBtn.addEventListener("click", () => {
    if (!readInput()) return;

    mainMenu.style.opacity = "0";
    newGameBtn.style.opacity = "1";
    newGameBtn.style.top = "10px";

    setTimeout(() => {
        mainMenu.style.display = "none";
        chameleonView.style.opacity = "0";
        chameleonView.style.display = "flex";
        chameleonView.offsetHeight;
        chameleonView.style.opacity = "1";
    }, 300);
    title.style.opacity = "0";
    startGame();
});

function updatePlayerDisplay() {
    playerIdx.textContent = `Player ${currentPlayer + 1} ${playerEmojis[currentPlayer]}`;
    wordBtn.textContent = "Hold to Reveal";
    wordBtn.classList.remove("holding");
    passBtn.style.display = "none";
}

function resetGame() {
    secretWord = "";
    chameleonIndex = -1;
    holdActive = false;
    playerCount = 0;
    currentPlayer = 0;
    playerEmojis = [];
    words = [];
    playerIdx.textContent = "Player 1";
    wordBtn.textContent = "Hold to Reveal";
    wordBtn.classList.remove("holding");
    passBtn.style.display = "none";
}

function readInput() {
    playerCount = parseInt(playercountInput.value);
    if (isNaN(playerCount) || playerCount < 3) {
        alert("Please enter a valid number of players (minimum 3).");
        return false;
    }
    localStorage.setItem("playerCount", playerCount);

    selected.forEach(cat => {
        words = words.concat(data[cat].words);
    });
    if (words.length === 0) {
        alert("Please select at least one word collection.");
        return false;
    }
    localStorage.setItem("selectedCollections", JSON.stringify(Array.from(selected)));
    return true;
}

function startGame() {
    secretWord = words[Math.floor(Math.random() * words.length)];
    chameleonIndex = Math.floor(Math.random() * playerCount);

    const shuffled = [...ANIMAL_EMOJIS].sort(() => Math.random() - 0.5);
    playerEmojis = shuffled.slice(0, playerCount);

    currentPlayer = 0;
    updatePlayerDisplay();
}

function onHoldStart(e) {
    e.preventDefault();
    holdActive = true;
    wordBtn.classList.add("holding");
    if (currentPlayer === chameleonIndex) {
        wordBtn.textContent = "🦎 Chameleon";
    } else {
        wordBtn.textContent = secretWord;
    }
}

function onHoldEnd(e) {
    if (!holdActive) return;
    holdActive = false;
    wordBtn.classList.remove("holding");
    wordBtn.textContent = "Hold to Reveal";

    const nextPlayer = (currentPlayer + 1) % playerCount;
    passBtn.textContent = `Pass to Player ${nextPlayer + 1} ${playerEmojis[nextPlayer]} →`;
    passBtn.style.display = "block";
}

wordBtn.addEventListener("mousedown", onHoldStart);
wordBtn.addEventListener("mouseup", onHoldEnd);
wordBtn.addEventListener("mouseleave", onHoldEnd);
wordBtn.addEventListener("touchstart", onHoldStart, { passive: false });
wordBtn.addEventListener("touchend", onHoldEnd);
wordBtn.addEventListener("touchcancel", onHoldEnd);

passBtn.addEventListener("click", () => {
    currentPlayer = (currentPlayer + 1) % playerCount;
    updatePlayerDisplay();
});

async function fetchCollections() {
    const response = await fetch("data.json");
    data = await response.json();
    const collectionsDiv = document.getElementById("collections");
    for (const collectionName in data) {
        const button = document.createElement("button");
        button.textContent = data[collectionName].title;
        button.dataset.cat = collectionName;
        button.onclick = () => {
            const cat = button.dataset.cat;
            button.classList.toggle("active");
            button.classList.contains("active")
                ? selected.add(cat)
                : selected.delete(cat);
        };
        collectionButtons.push(button);
        collectionsDiv.appendChild(button);
    }
}

fetchCollections();
