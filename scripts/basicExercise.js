class Word {
    constructor(initial, vowel, final, word) {
        this.initial = initial.toUpperCase();
        this.vowel = vowel.toUpperCase();
        this.final = final.toUpperCase();
        this.word = word;
    }

    get sound() { return `audio/word/${this.word}.mp3`; }
    get slow()  { return `audio/word/${this.word}Slow.mp3`; }
    get image() { return `img/word/${this.word}.png`; }

    loadWord(element) {
        let slowSound = new Audio(this.slow);

        element.addEventListener("click", () => {
            slowSound.play();
        });
    }
i}

class Exercise {
    constructor(word, exerciseName, correctAnswer, incorrectAnswers) {
        this.word = word;
        this.name = exerciseName;
        this.correct = correctAnswer(word); //function of type (Word, ) -> string;
        this.incorrect = incorrectAnswers(word, this.correct); //function of type (Word, ) -> [string, string, string];
        console.log(exerciseName, this.correct, this.incorrect);
        this.correctOption = Math.ceil(Math.random() * 4);
        //move audio elsewhere
        //this.correctSound = new Audio('audio/sfx/correct.mp3');
    }

    get prompt() { return `audio/exercise/${this.name}Prompt.mp3`; }
    get instruction() {return `audio/exercise/${this.name}Instruction.mp3`; }

    get option1() { return this.correctOption == 1 ? this.correct : this.incorrect[0]; }

    get option2() { return this.correctOption == 2 ? this.correct 
                         : this.correctOption == 1 ? this.incorrect[0]
                         : this.incorrect[1]; }
    
    get option3() { return this.correctOption == 3 ? this.correct 
                         : this.correctOption == 4 ? this.incorrect[2]
                         : this.incorrect[1]; }

    get option4() { return this.correctOption == 4 ? this.correct : this.incorrect[2]; }

    prepGrade(element, option) {
        let self = this;
        console.log("Pass grade to", option);
        if (option == self.correctOption) {
            element.addEventListener("click", () => {
                console.log(" Correct Answer");
                element.classList.add("correct");
                //add in SFX
                /*
                element.addEventListener('animationend', () => {
                    element.ownerDocument.location.refresh(true);
                });
                */
            });
        } else {
            element.addEventListener("click", () => {
                console.log(" Incorrect Answer");
                element.classList.add("incorrect");
            });
        }
    }

    loadInstruction(parrotElement) {
        let instruction = new Audio(this.instruction);

        parrotElement.addEventListener("click", () => {
            instruction.play();
        });
    }
}

let words = [
    ['c', 'a', 't', 'cat'],
    ['g', 'e', 'm', 'gem'],
    ['m', 'a', 'p', 'map'],
    ['n', 'u', 't', 'nut'],
    ['p', 'i', 'g', 'pig'],
/*    ['b', 'a', 't', 'bat'],
    ['r', 'a', 't', 'rat'],
    ['h', 'a', 't', 'hat'],
    ['b', 'a', 'g', 'bag'],
    ['c', 'a', 'n', 'can'],
    ['f', 'a', 'n', 'fan'],
    ['m', 'a', 'n', 'man'],
    ['p', 'a', 'n', 'pan'],
    ['v', 'a', 'n', 'van'],
    ['c', 'a', 'p', 'cap'],
    ['h', 'a', 'm', 'ham'],
    ['j', 'a', 'm', 'jam'],
    ['r', 'a', 'm', 'ram'],
    ['b', 'e', 'd', 'bed'],
    ['l', 'e', 'g', 'leg'],
    ['h', 'e', 'n', 'hen'],
    ['p', 'e', 'n', 'pen'],
    ['w', 'e', 'b', 'web'],
    ['d', 'o', 'g', 'dog'],
    ['b', 'u', 'g', 'bug'],
    ['s', 'u', 'n', 'sun'],
    
    ['c', 'u', 'p', 'cup'],*/
];

function randomInt(min, max) {return min + Math.floor(Math.random() * (max - min + 1)); };
function randomLetter() { return String.fromCharCode(randomInt(65,90)); }

function incorrect(notAllowed, word, correct) {
    notAllowed.push(correct);
    let distractors = [];
    for (let i = 0; i < 3; i++) {
        let newLetter = randomLetter();
        while (notAllowed.includes(newLetter)) {
            newLetter = randomLetter();
            console.log(newLetter);
        }
        notAllowed.push(newLetter);
        distractors.push(newLetter);
    }

    return distractors;
};


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
    console.log("The exercise choice is", exercises[exerciseChoice][0]);
    let exercise = new Exercise(word, ...exercises[exerciseChoice]);

    //set up word image
    document.getElementById("word").src = word.image;

    //set up answers
    console.log("Options:", exercise.option1, exercise.option2, exercise.option3, exercise.option4);
   
    let opt1 = document.getElementById("ans1")
    opt1.innerHTML = exercise.option1;

    let opt2 = document.getElementById("ans2")
    opt2.innerHTML = exercise.option2; 

    let opt3 = document.getElementById("ans3")
    opt3.innerHTML = exercise.option3;
    
    let opt4 = document.getElementById("ans4")
    opt4.innerHTML = exercise.option4;

    exercise.prepGrade(opt1,1);
    exercise.prepGrade(opt2,2);
    exercise.prepGrade(opt3,3);
    exercise.prepGrade(opt4,4);

    console.log("Options initialized.")


    //play audio 
    console.log("Play Audio prompt and sound");
    let instructionAudio = new Audio(exercise.prompt);
    let wordAudio = new Audio(word.sound);

    /*
    instructionAudio.addEventListener("canplaythrough", () => {
        instructionAudio.play();
    }); 

    instructionAudio.addEventListener("ended", () => {
        wordAudio.addEventListener("canplaythrough", () => {
            wordAudio.play();
        });
    })
    */

    //set up prompt
    exercise.loadInstruction(document.getElementById("parrot"));

    //set up word audio
    word.loadWord(document.getElementById("word"));
})();
