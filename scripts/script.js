// const keyboardDiv = $(".keyboard"); // Doesn't work as of now
const keyboardDiv = document.querySelector(".keyboard");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainButton = document.querySelector(".play-again");

let currentWord, wrongGuessCount = 0, correctLetters = [];
const maxGuesses = 6;

const resetGame = ()=>{
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn=>{btn.disabled = false});
    wordDisplay.innerHTML = currentWord.split("").map(()=>`<li class="letter"></li>`).join("");
    gameModal.classList.remove("show");
}

const getRandomWord = ()=>{
    // get random word and hint from wordList
    const {word, hint} = wordList[Math.floor(Math.random()*wordList.length)];
    currentWord = word;
    // console.log(word,hint);
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) =>{
    setTimeout(()=>{
        const modalText = isVictory? `You found the word: ` : `The correct word was: `;
        gameModal.querySelector("img").src = `images/${isVictory? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory? 'Congrats!' : 'Game Over!'}`;
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    },300);
}

const initGame = (button, clickedLetter) => {
    // console.log(button, clickedLetter);
    if(currentWord.includes(clickedLetter)){
        [...currentWord].forEach((letter,index)=>{
            if(letter === clickedLetter){
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else{
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Dynamically creating keyboard buttons
// ASCII of 'a' and 'z' are 97 and 122 respectively
for(let i=97; i <= 122; i++){
    // console.log(String.fromCharCode(i));
    const button  = document.createElement("button");
    button.classList.add(String.fromCharCode(i));
    button.innerText = String.fromCharCode(i);
    keyboardDiv.append(button);
    button.addEventListener("click", e=>initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();
playAgainButton.addEventListener("click", getRandomWord);

// Keyboard Functionality
// If keyboard is pressed, equivalent button is clicked on the html
document.addEventListener('keydown', e => {
    if (e.key >= String.fromCharCode(97) && e.key <= String.fromCharCode(122)) {
        document.querySelector(`.${e.key}`).click();
    } else if((e.code === 'Space' || e.key === 'Enter') && (wrongGuessCount === maxGuesses || correctLetters.length === currentWord.length)){
        playAgainButton.click();
    }
});