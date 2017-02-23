//Game constructor
function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber()
}

function generateWinningNumber() {
    return Math.floor(Math.random()*100+1)
}

function newGame() {
    return new Game
}

//Game methods
Game.prototype.difference = function() {
    return Math.abs(this.playersGuess-this.winningNumber)
}

Game.prototype.isLower = function() {
    return this.winningNumber-this.playersGuess>0;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if (guess<1 || guess>100 || isNaN(guess)) {
        throw 'That is an invalid guess.'
    } else {
        this.playersGuess = guess;
        return this.checkGuess()
    }  
}

Game.prototype.checkGuess = function() {
    if (this.pastGuesses.indexOf(this.playersGuess)>-1) {
        return 'You already guessed that number.'
    } else {
        this.pastGuesses.push(this.playersGuess)
        if (this.playersGuess===this.winningNumber) {
            endOfGame()
            return 'You got it! The winning number was ' + this.winningNumber + '!'
        } else {
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if (this.pastGuesses.length>=5) {
                endOfGame()
                return 'You Lose. The winning number was ' + this.winningNumber + '!'
            } else {
                var guidance = this.isLower() ? 'Guess Higher!' : 'Guess Lower!'
                $('h2').text(guidance)
                var howClose = this.difference()
                if (howClose<10) {
                    return 'You\'re burning up!'
                } else if (howClose<25) {
                    return 'You\'re lukewarm.'
                } else if(howClose<50) {
                    return 'You\'re a bit chilly.'
                } else {
                    return 'You\'re ice cold!'
                }
            }
        }
    }
}

function endOfGame() {
    $('h2').text('Press Reset to play again.')
    $('#submit').prop('disabled', true)
    $('#hint').prop('disabled', true)
}

Game.prototype.produceHintArr = function() {
    var hintArr = [this.winningNumber, 
    generateWinningNumber(), 
    generateWinningNumber(),
    generateWinningNumber()];
    return shuffle(hintArr).join(', ')
}

//To shuffle hintArr
function shuffle(arr) {
    var end = arr.length, i, swap;
    while(end) {
        i = Math.floor(Math.random() * end--)
        swap = arr[end]
        arr[end] = arr[i]
        arr[i] = swap
    }
    return arr;
}

//Functions for Button events
function guessSubmitted(game) {
    var currentGuess = +$('#number-input').val()
    $('#number-input').val('')

    var response = game.playersGuessSubmission(currentGuess)
    $('h1').text(response)
}

//Button functionality
$(document).ready(function() {
    var game = newGame()

    $('#submit').click(function() {
        guessSubmitted(game)  
    })

    $('#number-input').keypress(function() {
        if (event.which==13) guessSubmitted(game)
    })

    $('#hint').click(function() {
        $('h1').text('One of these is the winning number:')
        $('h2').text(game.produceHintArr())
    })

    $('#reset').click(function() {
        game = newGame()
        $('h1').text('GUESSING GAME')
        $('h2').text('Guess a number between 1 & 100')
        $('.guess').text('--')
        $('#submit').prop('disabled', false)
        $('#hint').prop('disabled', false)
    })
})