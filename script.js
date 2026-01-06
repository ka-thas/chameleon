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


let data = {};
let currentCollections = [];
let selected = new Set();

let words = [];


newGameBtn.addEventListener("click", () => {
    // swap views
    mainMenu.style.display = "flex";
    chameleonView.style.display = "none";
    resetGame();
});

startBtn.addEventListener("click", () => {
    // 
    playerCount = parseInt(playercountInput.value);
    if (isNaN(playerCount) || playerCount < 3) {
        alert("Please enter a valid number of players (minimum 3).");
        return;
    }

    // swap views
    mainMenu.style.display = "none";
    chameleonView.style.display = "flex";
    startGame();
    
});

function resetGame() {
    secretWord = "";
    chameleonIndex = -1;
    wordShown = false;
    playerCount = 0;
    currentPlayer = 0;
    words = [];
    playerIdx.textContent = `Player ${currentPlayer + 1}`;
    wordBtn.textContent = "Reveal Secret Word";
}

function startGame() {
    // gather words from selected collections
    selected.forEach(cat => {
            words = words.concat(data[cat].words);
        
    });
    if (words.length === 0) {
        alert("Please select at least one word collection.");
        // return to main menu
        mainMenu.style.display = "flex";
        chameleonView.style.display = "none";
        return;
    }

    // select secret word and chameleon
    secretWord = words[Math.floor(Math.random() * words.length)];
    chameleonIndex = Math.floor(Math.random() * playerCount);
}


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

// Load collections from data.json


async function fetchCollections() {
    const response = await fetch("data.json");
    data = await response.json();
    console.log(data);
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
        console.log(selected);
        }
        button.style.margin = "6px";
        collectionsDiv.appendChild(button);
    }
}
fetchCollections();