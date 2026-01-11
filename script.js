// html elements
let title = document.getElementById("title");
let playercountInput = document.getElementById("player-count");
let startBtn = document.getElementById("start-button");
let wordBtn = document.getElementById("word-button");
let newGameBtn = document.getElementById("new-game-button");
let mainMenu = document.getElementById("main-menu");
let chameleonView = document.getElementById("chameleon-view");
let playerIdx = document.getElementById("playerIdx");

let secretWord = "";
let chameleonIndex = -1;
let wordShowing = false;
let playerCount = 0;
let currentPlayer = 0;


let data = {};
let currentCollections = [];
let selected = new Set();
let collectionButtons = [];

let words = [];

// if data in localstorage, load it
if (localStorage.getItem("playerCount")) {
    playercountInput.value = localStorage.getItem("playerCount");
}
if (localStorage.getItem("selectedCollections")) {
    const savedCollections = JSON.parse(localStorage.getItem("selectedCollections"));
    savedCollections.forEach(cat => selected.add(cat));
}


newGameBtn.addEventListener("click", () => {
    // swap views
    chameleonView.style.opacity = "0";
    //wait for transition
    setTimeout(() => {
        chameleonView.style.display = "none";
        mainMenu.style.opacity = "0";
        mainMenu.style.display = "flex";
        mainMenu.offsetHeight;
        mainMenu.style.opacity = "1";
    }, 300);
    // reset title size
    title.style.fontSize = "";
    resetGame();
});

startBtn.addEventListener("click", () => {
    // read input values and validate
    if (!readInput()) {
        return;
    }

    // swap views
    mainMenu.style.opacity = "0";
        //wait for transition
    setTimeout(() => {
        mainMenu.style.display = "none";
        chameleonView.style.opacity = "0";
        chameleonView.style.display = "flex";
          chameleonView.offsetHeight;
        chameleonView.style.opacity = "1";
    }, 300);
    title.style.fontSize = "32px";
    startGame();
    
});

function resetGame() {
    secretWord = "";
    chameleonIndex = -1;
    wordShowing = false;
    playerCount = 0;
    currentPlayer = 0;
    words = [];
    playerIdx.textContent = `Player 1`;
    wordBtn.textContent = "Reveal Secret Word";
}

// reads input values and saves them to localstorage
function readInput() {

    // read player count
    playerCount = parseInt(playercountInput.value);
    if (isNaN(playerCount) || playerCount < 3) {
        alert("Please enter a valid number of players (minimum 3).");
        return false;
    }
    localStorage.setItem("playerCount", playerCount);

    // gather words from selected collections
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
    // select secret word and chameleon
    secretWord = words[Math.floor(Math.random() * words.length)];
    chameleonIndex = Math.floor(Math.random() * playerCount);
}


// reveal word button
wordBtn.addEventListener("click", () => {
    if (wordShowing) {
        wordBtn.textContent = "Reveal Secret Word";
        wordBtn.style.backgroundColor = "#33e27633";
        wordShowing = false;
        currentPlayer = (currentPlayer + 1) % playerCount;
        playerIdx.textContent = `Player ${currentPlayer + 1}`;
        return;
    } 
    wordShowing = true;
    wordBtn.style.backgroundColor = "#0003";
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
        collectionButtons.push(button);
        collectionsDiv.appendChild(button);
    }
}

fetchCollections();