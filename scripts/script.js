const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");


let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6; 

const resetGame = () => {
    // Ressetting all game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = 1;
        btn.style.pointerEvents = "auto";
    });
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>  `).join("");
    gameModal.classList.remove("show"); 
}

// Selecting a random word with its hint from word-list.js
const getRandomWord = () =>  {
    const {word, hint} = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    console.log(word);
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) => {
    // After you complete the game a modal pops up showing if you won or lost
    setTimeout(() => {
        const modalText = isVictory ? `You found the word:` : `The correct word was:`;
        gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'Congrats!' : 'Game Over'}`;
        gameModal.querySelector("p").innerHTML =  `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show"); 
    }, 300)
}

const initGame = (button, clickedLetter) => {
    // Checks if the letter clicked exist in the current word
    if(currentWord.includes(clickedLetter)){
        // Showing every correctly guessed letter on the word display
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })   
    } else {
        // If you guess a wrong letter wrongGuessCount goes up by 1 and the hangman image is changed
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true;
    document.getElementById(clickedLetter).style.opacity = 0.6
    document.getElementById(clickedLetter).style.pointerEvents = "none"


    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; 

    // Calls the gameOver function if any of the following conditions are met
    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
}

// Making keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++){
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    button.setAttribute("id",String.fromCharCode(i))
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)))
    
}

getRandomWord();

playAgainBtn.addEventListener("click", getRandomWord)