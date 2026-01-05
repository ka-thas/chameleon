// html elements
let playercountInput = document.getElementById("player-count");
let startBtn = document.getElementById("start-button");
let wordBtn = document.getElementById("word-button");
let newGameBtn = document.getElementById("new-game-button");
let mainMenu = document.getElementById("main-menu");
let chameleonView = document.getElementById("chameleon-view");
let playerIdx = document.getElementById("playerIdx");

let secretWord = "";
let chameleonIndex = -1;
let wordShown = false;
let playerCount = 0;
let currentPlayer = 0;

let words = ["apple", "banana", "cherry", "date", "fig", "grape"];

newGameBtn.addEventListener("click", () => {
    // swap views
    mainMenu.style.display = "flex";
    chameleonView.style.display = "none";
});

startBtn.addEventListener("click", () => {
    playerCount = parseInt(playercountInput.value);
    if (isNaN(playerCount) || playerCount < 3) {
        alert("Please enter a valid number of players (minimum 3).");
        return;
    }

    // swap views
    mainMenu.style.display = "none";
    chameleonView.style.display = "flex";

    secretWord = words[Math.floor(Math.random() * words.length)];
    chameleonIndex = Math.floor(Math.random() * playerCount);
});

// reveal word button
wordBtn.addEventListener("click", () => {
    if (wordShown) {
        wordBtn.textContent = "Reveal Secret Word";
        wordShown = false;
        currentPlayer = (currentPlayer + 1) % playerCount;
        playerIdx.textContent = `Player ${currentPlayer + 1}`;
        return;
    } 
    wordShown = true;
    if (currentPlayer === chameleonIndex) {
        wordBtn.textContent = "Chameleon";
    } else {
        wordBtn.textContent = secretWord;
    }
});


