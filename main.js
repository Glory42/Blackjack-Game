let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck;

let canHit = true;

let playerScore = 0;
let dealerScore = 0;

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
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
    console.log(deck); // Debugging
}


function shuffleDeck() {
    for(let i = 0; i< deck.length; i++){
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}


function startGame() {
    document.getElementById("hit").removeEventListener("click", hit);
    document.getElementById("stand").removeEventListener("click", stand);

    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;

    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src="./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-Cards").append(cardImg); 
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src="./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-Cards").append(cardImg); 
    }
    console.log(yourSum);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
    document.getElementById("next-round").addEventListener("click", resetGame);
    
}

function endGame(message) {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    document.getElementById("hidden").src="./cards/" + hidden + ".png";

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;

    if (message === "You Win!") {
        playerScore++;
    } else if (message === "You lose!") {
        dealerScore++;
    }
    
    document.getElementById("player-score").innerText = playerScore;
    document.getElementById("dealer-score").innerText = dealerScore;
    document.getElementById("next-round").style.display = "block";
    
    canHit = false;
}

function resetGame() {
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;

    buildDeck(); 
    shuffleDeck(); 

    
    document.getElementById("dealer-Cards").innerHTML = `<img id="hidden" src="./cards/BACK.png">`;
    document.getElementById("your-Cards").innerHTML = "";

    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";
    document.getElementById("results").innerText = "";

    document.getElementById("next-round").style.display = "none";

    startGame();
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
    document.getElementById("stand").disabled = true; // Disable stand button

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