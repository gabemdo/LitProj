class Word {
    constructor(initial, vowel, final, word) {
        this.initial = initial.toUpperCase();
        this.vowel = vowel.toUpperCase();
        this.final = final.toUpperCase();
        this.sound = `audio/word/${word}.mp3`;
        this.slow = `audio/word/${word}Slow.mp3`;
        this.image = `img/word/${word}.png`;
    }

    get initial() {return this.initial;}

    get vowel() {return this.vowel;}

    get final() {return this.final;}

    get sound() {return this.sound;}

    get image() {return this.image;}

    loadWord(element) {
        let slowSound = new Audio(this.slow);

        element.addEventListener("click", () => {
            slowSound.play();
        });
    }
}

class Exercise {
    constructor(word, exerciseName, correctAnswer, incorrectAnswers) {
        this.word = word;
        this.prompt = `audio/exercise/${exerciseName}Prompt.mp3`;
        this.instruction = `audio/exercise/${exerciseName}Instruction.mp3`;
        this.correct = correctAnswer(word, ); //function of type (Word, ) -> string;
        this.incorrect = incorrectAnswers(word, this.correct, ); //function of type (Word, ) -> [string, string, string];
        this.correctOption = Math.ceil(Math.random() * 4);
        this.correctSound = new Audio('audio/sfx/correct.mp3');
    }

    get word() { return this.word; };

    get option1() { return this.correctOption == 1 ? this.correct : this.incorrect[0]; }

    get option2() { return this.correctOption == 2 ? this.correct 
                         : this.correctOption == 1 ? this.incorrect[0]
                         : this.incorrect[1]; }
    
    get option3() { return this.correctOption == 3 ? this.correct 
                         : this.correctOption == 4 ? this.incorrect[2]
                         : this.incorrect[1]; }

    get option4() { return this.correctOption == 4 ? this.correct : this.incorrect[2]; }

    grade(element, option) {
        if (option == this.correctOption) {
            //show answer is correct 
            this.correctSound.play();
            element.classList.add("correct"); 
            element.addEventListener('animationend', () => {
                elementownerDocument.location.refresh(true);
            })
        } else {
            //show answer is incorrect
            element.classList.add("incorrect");
        }
    }

    loadInstruction(parrotElement) {
        let instruction = new Audio(this.instruction);

        parrotElement.addEventListener("click", () => {
            instruction.play();
        });
    }
}

function randomInt(min, max) {return min + Math.floor(Math.random * (max - min + 1)); };
function randomLetter() { return String.fromCharCode(randomInt(65,91)); }
function newPush(array, value) { return [...array, value]; }

function incorrect(notAllowed, word, correct) {
    notAllowed = newPush(notAllowed, correct);
    let distractors = [];
    for (let i = 0; i < 3; i++) {
        let newLetter = randomLetter();
        while (newLetter in notAllowed) {
            newLetter = randomLetter();
        }
        notAllowed = newPush(notAllowed, newLetter);
        distractors = newPush(distractors, newLetter);
    }

    return distractors;
};

let words = [
    ['c', 'a', 't', 'cat'],
    ['b', 'a', 't', 'bat'],
    ['r', 'a', 't', 'rat'],
    ['h', 'a', 't', 'hat'],
    ['b', 'a', 'g', 'bag'],
    ['c', 'a', 'n', 'can'],
    ['f', 'a', 'n', 'fan'],
    ['m', 'a', 'n', 'man'],
    ['p', 'a', 'n', 'pan'],
    ['v', 'a', 'n', 'van'],
    ['c', 'a', 'p', 'cap'],
    ['m', 'a', 'p', 'map'],
    ['h', 'a', 'm', 'ham'],
    ['j', 'a', 'm', 'jam'],
    ['r', 'a', 'm', 'ram'],
    ['b', 'e', 'd', 'bed'],
    ['l', 'e', 'g', 'leg'],
    ['h', 'e', 'n', 'hen'],
    ['p', 'e', 'n', 'pen'],
    ['w', 'e', 'b', 'web'],
    ['g', 'e', 'm', 'gem'],
    ['p', 'i', 'g', 'pig'],
    ['d', 'o', 'g', 'dog'],
    ['b', 'u', 'g', 'bug'],
    ['s', 'u', 'n', 'sun'],
    ['n', 'u', 't', 'nut'],
    ['c', 'u', 'p', 'cup'],
];

let incorrectFirst = function(word, correct) {
    return incorrect([word.vowel],word,correct);
}

let incorrectLast = incorrectFirst;

let incorrectMiddle = function(word, correct) {
    return incorrect([], word, correct);
}


function correctFirst(word) { return word.initial; };
function correctMiddle(word) { return word.vowel; };
function correctLast(word) { return word.final; };


let exercises = [
    ['identifyFirst', correctFirst, incorrectFirst],
    ['identifyMiddle', correctMiddle, incorrectMiddle],
    ['identifyLast', correctLast, incorrectLast],
];


(function() {
    //pick word
    let wordChoice = Math.floor(Math.random() * words.length);
    console.log("The word choice is",words[wordChoice][3]);

    let word = new Word(...(words[wordChoice]));

    //pick exercise
    let exerciseChoice = Math.floor(Math.random() * exercises.length);
    console.log("The exercise choice is", exercises][exerciseChoice][0]);
    let exercise = new Exercise(word, ...exercises[exerciseChoice]);

    //set up word image
    document.getElementByID("word").src = word.image;

    //set up answers
    console.log("Options:", exercise.option1, exercise.option2, exercise.option3, exercise.option4);
    document.getElementByID("ans1").innerHTML = exercise.option1;
    document.getElementByID("ans2").innerHTML = exercise.option2; 
    document.getElementByID("ans3").innerHTML = exercise.option3;
    document.getElementByID("ans4").innerHTML = exercise.option4;

    document.getElementByID("ans1").onClick = exercise.grade(this, 1);
    document.getElementByID("ans2").onClick = exercise.grade(this, 2);
    document.getElementByID("ans3").onClick = exercise.grade(this, 3);
    document.getElementByID("ans4").onClick = exercise.grade(this, 4);


    //play audio 
    console.log("Play Audio prompt and sound");
    let instructionAudio = new Audio(exercise.prompt);
    let wordAudio = new Audio(word.sound);

    instructionAudio.addEventListener("canplaythrough", () => {
        instructionAudio.play();
    }); 

    instructionAudio.addEventListener("ended", () => {
        wordAudio.addEventListener("canplaythrough", () => {
            wordAudio.play();
        });
    })

    //set up prompt
    exercise.loadInstruction(document.getElementByID("parrot"));

    //set up word audio
    word.loadWord(document.getElemntByID("word"));
})();
