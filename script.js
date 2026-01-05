// html elements
let playercountInput = document.getElementById("player-count");
let startBtn = document.getElementById("start-button");
let wordBtn = document.getElementById("word-button");
let newGameBtn = document.getElementById("new-game-button");
let mainMenu = document.getElementById("main-menu");
let chameleonView = document.getElementById("chameleon-view");


newGameBtn.addEventListener("click", () => {
    mainMenu.style.display = "block";
    chameleonView.style.display = "none";
});

startBtn.addEventListener("click", () => {
    let playerCount = parseInt(playercountInput.value);
    if (isNaN(playerCount) || playerCount < 3) {
        alert("Please enter a valid number of players (minimum 3).");
        return;
    }

    startGame(playerCount);
});

wordBtn.addEventListener("click", () => {
    alert("The secret word is: " + secretWord);
});

let secretWord = "";

function startGame(playerCount) {
    // Hide main menu and show chameleon view
    mainMenu.style.display = "none";
    chameleonView.style.display = "block";

    // Select a random secret word from a predefined list
    const words = ["apple", "banana", "cherry", "date", "fig", "grape"];
    secretWord = words[Math.floor(Math.random() * words.length)];

    // Randomly assign one player as the Chameleon
    const chameleonIndex = Math.floor(Math.random() * playerCount);
    for (let i = 0; i < playerCount; i++) {
        if (i === chameleonIndex) {
            console.log(`Player ${i + 1} is the Chameleon!`);
        } else {
            console.log(`Player ${i + 1} sees the word: ${secretWord}`);
        }
    }
}

