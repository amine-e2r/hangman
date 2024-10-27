let words = [];

const fs = require('fs');

var games = {};
var users = {};

class Game {
    static id = 0;

    constructor(word,length){
        this.word = word;
        this.wordLength = length;
        this.error = 0;
        this.good = 0;
        this.gameId = Game.id++;
        this.guessed = [];
        for ( let i = 0; i < length; i++ ) {
            this.guessed.push(' ');
        }
    }
    }

fs.readFile('lesmiserables.txt','utf-8',function(error, data) {
    if(error){
        console.log(error);
    }
    else{
        let list = data.split(/[(\r?\n),. ]/);
        for(let i = 0; i < list.length; i++){
            var low = true;
            if(!words.includes(list[i])){
                if(list[i].length < 6 || list[i].length > 8){
                    low = false;
                }
                for(let j = 0; j<list[i].length;j++){
                    if(list[i].charCodeAt(j) > 122 || list[i].charCodeAt(j) < 97){
                        low = false;
                    }
                }
            }
            if(low) words.push(list[i]);
        }
        
    }     
});


function manageRequest(request, response) {
    response.statusCode = 200;
    let path = (request.url.split('?')[0]).split("/")[2];
    if(request.url.split('?').length > 1) var details = (request.url.split('?')[1]).split("=")[1];

    if(path == "getWord"){
        response.setHeader('Access-Control-Allow-Origin','*');
        theWord = chooseWord();
        response.end(theWord);
    }
    if(path == "newGame"){
        let word = chooseWord();
        let length = word.length;
        let gameInstance = new Game(word,length); 
        games[gameInstance.gameId] = gameInstance;
        let reponse = {gameId : gameInstance.gameId, wordLength : gameInstance.wordLength}
        console.log(games);
        response.end(JSON.stringify(reponse));
    }
    
    
    if(path == "testLetter"){
        let id = request.headers.token;
        let game = games[id];
        let listWord = game.word.toUpperCase().split("");
        
        var isCorrect = false;
        var gameOver = false;
        var position = [];
        var word = "";
        
        console.log(game.word);
        
        for(let i = 0; i < listWord.length; i++){
            if(listWord[i] == details.toUpperCase()) {
                game.guessed[i] = details;
                game.good += 1;
                isCorrect = true;
                position.push(i);
            }
        }
        if(!isCorrect){
                game.error += 1
        }
        if(game.error >= 7 || game.good == game.wordLength){
            word = game.word.toUpperCase();
            gameOver = true;
            games.delete(id.toString());
        }
        let reponse = {isCorrect : "value", letter : "value", isGameOver : "value", positions : "positions", word : "word" }
        reponse['isCorrect'] = isCorrect;
        reponse['letter'] = details.toUpperCase();
        reponse['isGameOver'] = gameOver;
        reponse['positions'] = position;
        reponse['word'] = word;
        
        console.log(reponse)
        response.end(JSON.stringify(reponse));
    }
}

function chooseWord(){
    return words[Math.floor(Math.random()*words.length)];
}

exports.manage = manageRequest;