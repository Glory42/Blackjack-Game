let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck;

let canHit = true;

let playerScore = 0;
let dealerScore = 0;

let playerBank = 1000;
let currentBet = 0;
let totalWinnings = 0;

window.onload = function() {
    buildDeck();
    shuffleDeck();
    
    const controlsDiv = document.createElement('div');
    controlsDiv.innerHTML = `
        <div class="bank-info">
            <span>Bank: <span id="player-bank">$1,000</span></span>
            <span>Total Winnings: <span id="total-winnings">$0</span></span>
            <span>Current Bet: <span id="current-bet">$0</span></span>
        </div>
    `;
    document.querySelector('.game-container').insertBefore(controlsDiv, document.querySelector('.game-title').nextSibling);

    updateBankDisplay();
    handleBetButtons();

    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
}

function updateBankDisplay() {
    document.getElementById('player-bank').textContent = `$${playerBank.toLocaleString()}`;
    document.getElementById('total-winnings').textContent = `$${totalWinnings.toLocaleString()}`;
}

function placeBet(betAmount) {
    if (betAmount > playerBank) {
        alert("You don't have enough money to place this bet!");
        return false;
    }
    
    if (betAmount <= 0) {
        alert("Bet amount must be greater than zero!");
        return false;
    }
    
    currentBet = betAmount;
    playerBank -= betAmount;

    document.getElementById('current-bet').textContent = `$${currentBet.toLocaleString()}`;
    updateBankDisplay();
    
    return true;
}

function handleBetButtons(){
    const betButtonsDiv = document.createElement('div');
    betButtonsDiv.className = 'bet-buttons';
    betButtonsDiv.innerHTML = `
        <button class="bet-btn" data-bet="10">$10</button>
        <button class="bet-btn" data-bet="25">$25</button>
        <button class="bet-btn" data-bet="50">$50</button>
        <button class="bet-btn" data-bet="100">$100</button>
        <button class="bet-btn" data-bet="all">All In</button>
    `;

    const gameContainer = document.querySelector('.game-container');
    const existingBetButtons = document.querySelector('.bet-buttons');
    if (existingBetButtons) {
        gameContainer.removeChild(existingBetButtons);
    }
    
    gameContainer.insertBefore(betButtonsDiv, document.querySelector('.game-title').nextSibling);

    document.querySelectorAll('.bet-btn').forEach(button => {
        button.addEventListener('click', () => {
            const betAmount = button.dataset.bet === 'all' 
                ? playerBank 
                : parseInt(button.dataset.bet);
            
            if (placeBet(betAmount)) {
                betButtonsDiv.style.display = 'none';
                startGame();
            }
        });
    });
}

function buildDeck() {
    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J'];
    let types = ['C', 'D', 'H', 'S'];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + '-' + types[i]);
        }
    }
}

function shuffleDeck() {
    for(let i = 0; i < deck.length; i++){
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;

    document.getElementById("dealer-Cards").innerHTML = `<img id="hidden" src="./cards/BACK.png">`;
    document.getElementById("your-Cards").innerHTML = "";
    
    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";
    document.getElementById("results").innerText = "";

    hidden = deck.pop();
    
    let visibleCard = deck.pop();
    let visibleCardImg = document.createElement("img");
    visibleCardImg.src = "./cards/" + visibleCard + ".png";
    document.getElementById("dealer-Cards").appendChild(visibleCardImg);

    dealerSum = getValue(visibleCard);
    dealerAceCount = checkAce(visibleCard);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-Cards").append(cardImg); 
    }

    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
    document.getElementById("next-round").addEventListener("click", resetGame);
}

function endGame(message) {
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    dealerSum = reduceAce(dealerSum, dealerAceCount);

    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;

    if (message === "You Win!") {
        playerScore++; 
        playerBank += (currentBet * 2);
        totalWinnings += currentBet;
    } else if (message === "You lose!") {
        dealerScore++; 
    } else if (message === "Tie") {
        playerBank += currentBet; 
    }
    
    document.getElementById("player-score").innerText = playerScore;
    document.getElementById("dealer-score").innerText = dealerScore;
    document.getElementById("next-round").style.display = "block";
    
    updateBankDisplay();

    canHit = false;

    if (playerBank <= 0) {
        alert("Game Over! You've run out of money!");
        resetFullGame();
    }
}

function resetGame() {
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;
    currentBet = 0;

    buildDeck(); 
    shuffleDeck(); 

    document.getElementById("dealer-Cards").innerHTML = `<img id="hidden" src="./cards/BACK.png">`;
    document.getElementById("your-Cards").innerHTML = "";

    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";
    document.getElementById("results").innerText = "";
    document.getElementById("current-bet").innerText = "$0";

    document.getElementById("next-round").style.display = "none";

    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;

    handleBetButtons();
}

function resetFullGame() {
    playerBank = 1000;
    totalWinnings = 0;
    playerScore = 0;
    dealerScore = 0;
    
    document.getElementById("player-score").innerText = playerScore;
    document.getElementById("dealer-score").innerText = dealerScore;
    
    updateBankDisplay();
    
    resetGame();
}

function hit() {
    if(!canHit) {
        return;
    }
    
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src="./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-Cards").append(cardImg); 

    if(reduceAce(yourSum, yourAceCount) >= 21) {
        canHit = false;
        document.getElementById("stand").disabled = true;
        endGame('You lose!');
    }
}

function stand() {
    canHit = false;
    document.getElementById("stand").disabled = true;

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src="./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-Cards").append(cardImg); 
    }

    if (yourSum <= 21) {
        endGame(yourSum > dealerSum ? "You Win!" : dealerSum > 21 ? "You Win!" : yourSum == dealerSum ? "Tie" : "You lose!");
    }
}

function getValue(card) {
    let data = card.split('-');
    let value = data[0];

    if (isNaN(value)) {
        if(value == 'A') {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if(card[0] == 'A') {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while(playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}
