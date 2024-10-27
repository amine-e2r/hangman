const start = document.getElementById("start");
const idHidding = ["main","letters","game","start"];
const word2guess = document.getElementById("word2guess");
const guess = document.getElementById("text");
const testButton = document.getElementById("test");
const hangman = ["#i1","#i2","#i3","#i4","#i5","#i6","#i7"];
const again = document.getElementById("again");
const win = document.getElementById("win");
const letters = document.querySelectorAll("span");

start.addEventListener("click",newGame);
again.addEventListener("click",newGame);
testButton.addEventListener("click",testLetter);
guess.addEventListener('keypress',function(event){
    if(event.key == 'Enter') testLetter();
})

var isGameOver = false;
var count = 0;
var wordLength = 0;
var guesses = [];
let token;

async function newGame() {
    await getWord();
    count = 0;
    guesses = [];
    isGameOver = false;
    win.innerText = "";
    
    document.getElementById("main").classList.remove("notDisplayed");
    document.getElementById("letters").classList.remove("notDisplayed");
    document.getElementById("game").classList.remove("notDisplayed");
    start.classList.add("notDisplayed");
    again.classList.add('notDisplayed');
    

    for ( let i = 0; i < wordLength; i++ ) {
        guesses.push('_');
    }
    word2guess.innerText = guesses.join(' ');

    for ( let j = 0; j < hangman.length; j++ ){
        document.querySelector(hangman[j]).classList.remove("notDisplayed");
    }

    for(var i of letters){
        i.classList.remove('wrong');
        i.classList.remove('correct');
    }
}


async function getWord() {
    try {
        let infos = await fetch("http://localhost:8000/api/newGame");

        if (!infos.ok) {
            console.error("Bad response from the server");
            return;
        }
        const jsondata = await infos.json();
        wordLength = jsondata["wordLength"];
        token = jsondata["gameId"];
        console.log("ok")
        console.log(wordLength);
    } catch (error) {
        console.error("Error while connecting to the server", error);
    }
}

async function testLetter(){
    if(isGameOver == true) return;
    try {
        let infos = await fetch("http://localhost:8000/api/testLetter?letter=" + guess.value.toUpperCase(),{
            headers: {'token': token,}
        });
        if (!infos.ok) {
            console.error("Bad response from the server");
            return;
        }
        const jsondata = await infos.json();
        
        isGameOver = jsondata["isGameOver"];
        console.log(isGameOver)
        let isCorrect = jsondata["isCorrect"];
        let letter = jsondata["letter"];
        guess.value = "";

        console.log("tg")
        console.log(letter)
        console.log(jsondata)

        changeColor(isCorrect,letter);
        if(isCorrect){
            let positions = jsondata["positions"];
            place(positions,letter);
            if(isGameOver){
                winner(true);
                again.classList.remove("notDisplayed");
                disconnect.classList.remove('notDisplayed');
            }
        }
        else{
            updateHangman(count);
            count += 1;
            if(isGameOver){
                winner(false);
                guesses = jsondata["word"].split('');
                word2guess.innerText = guesses.join(' ');
                again.classList.remove("notDisplayed");
                disconnect.classList.remove('notDisplayed');
            }
        }

    } catch (error) {
        console.error("Error while connecting to the server", error);
    }
}

function winner(w){
    if(w) {
        win.innerText= "Tu as gagné !";
    }
    else{
        win.innerText = 'Tu as perdu !';
    }
}

function place(p, l){
    for(let i = 0; i < p.length; i++){
        guesses[p[i]] = l;
    }
    word2guess.innerText = guesses.join(' ');
}

function changeColor(correct,l){
    if(!correct){
        for(var i of letters){
            if(i.innerText == l){
                i.classList.add("wrong");
            }
        }
    }
    else{
        for(var i of letters){
            if (i.innerHTML == l){
                i.classList.add("correct");
            }
        }
    }
}

function updateHangman(id){
    document.querySelector(hangman[id]).classList.add("notDisplayed");
}

