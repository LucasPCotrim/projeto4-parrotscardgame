// -------------------------------- Global Variables --------------------------------

const gif_paths = ['imgs/bobrossparrot.gif',
                   'imgs/explodyparrot.gif',
                   'imgs/fiestaparrot.gif',
                   'imgs/metalparrot.gif',
                   'imgs/revertitparrot.gif',
                   'imgs/tripletsparrot.gif',
                   'imgs/unicornparrot.gif'] // array of gif paths
const sound_effects = {'bird': 'media/bird.wav',
                       'correct': 'media/correct.mp3',
                       'wrong': 'media/wrong.mp3',
                       'victory': 'media/victory.mp3'};
let play_sounds = true; // whether or not to play sound effects
const sound_volume = 0.7; // Global sound volume
const gif_indexes = [0,1,2,3,4,5,6]; // array of gif indexes from 'gif_paths'
let number_of_cards; // '4, 6, 8, 10, 12, 14'
let chosen_gif_indexes; // array of length 'number_of_cards' containing non-repeating paired indexes from 0 to 6.
let game_state; // 'playing', 'waiting' ,'won'
let cards_states;   // 'face_down', 'face_up_guessing', 'face_up_correct'
let number_of_plays; // number of times user has clicked to flip a card
let timer = 0; // Timer (in miliseconds)
let timer_interval;

// DOM objects
const DOM_card_container = document.querySelector('.card_container');
let DOM_cards;
const DOM_plays_display = document.querySelector('.n_plays_display');
const DOM_timer_display = document.querySelector('.timer_display');
const DOM_sound_status = document.querySelector('.bottom_menu > div:nth-child(3) h2');
const DOM_background_music = document.querySelector('audio');

// -------------------------------- Functions --------------------------------

//-------------------------------------------------------------------------
// Function: ask_number_of_cards()
// Description: Ask user the number of cards
//
// Inputs: none
//
// Outputs: n_cards;
//-------------------------------------------------------------------------
function ask_number_of_cards() {
    let n_cards;

    let valid_number = false;
    while (valid_number == false){
        n_cards = Number(prompt('Com quantas cartas quer jogar? (apenas números pares entre 4 e 14)'));
        if (n_cards % 2 == 0 && n_cards >= 4 && n_cards <= 14){
            valid_number = true;
        }
    }

    return n_cards;
}

//-------------------------------------------------------------------------
// Function: comparador()
// Description: 50% chance to return a positive number
//              and 50% chance to return a negative number
//
// Inputs: none
//
// Outputs: random_number (between -0.5 and 0.5);
//-------------------------------------------------------------------------
function comparador() { 
	return Math.random() - 0.5; 
}

//-------------------------------------------------------------------------
// Function: choose_gif_indexes_in_game()
// Description: Returns an array with the indexes of the random gifs to
//              be displayed in the game. Indexes are always in pairs and the length
//              of the array is 'number_of_cards'
//
// Inputs: none
//
// Outputs: chosen_indexes
//-------------------------------------------------------------------------
function choose_gif_indexes_in_game() {

    let chosen_indexes = [];
    let randomized_gif_indexes = [];

    for (let i = 0; i < gif_indexes.length; i++) {
        randomized_gif_indexes.push(gif_indexes[i]);
    }
    randomized_gif_indexes.sort(comparador);

    for (let i = 0; i < number_of_cards/2; i++) {
        chosen_indexes.push(randomized_gif_indexes[i]);
        chosen_indexes.push(randomized_gif_indexes[i]);
    }
    chosen_indexes.sort(comparador);

    return chosen_indexes;
}

//-------------------------------------------------------------------------
// Function: fill_cards()
// Description: Fills the 'card_container' div with 'number_of_cards'
//              instances of the 'card' div.
//
// Inputs: none
//
// Outputs: none
//-------------------------------------------------------------------------
function fill_cards() {

    for (let i = 0; i < number_of_cards; i++) {
        DOM_card_container.innerHTML += `
                                    <div class="card oscilate" data-identifier="card" onclick="update_board_state(${i})">
                                        <div class="card_back_face card_face" data-identifier="back-face">
                                            <img src="imgs/front.png">
                                        </div>
                                        <div class="card_front_face card_face" data-identifier="front-face">
                                            <img src="${gif_paths[chosen_gif_indexes[i]]}">
                                        </div>
                                    </div>
                                    `;
    }
    DOM_cards = document.querySelectorAll('.card');
}

//-------------------------------------------------------------------------
// Function: initialize_game()
// Description: Calls the 'fill_cards()' function and initializes
//              game variables such as 'cards_states', 'number_of_plays'
//              and 'game_state'
//
// Inputs: none
//
// Outputs: none
//-------------------------------------------------------------------------
function initialize_game() {

    fill_cards();

    cards_states = [];
    for (let i = 0; i < number_of_cards; i++) {
        cards_states.push('face_down');
    }
    number_of_plays = 0;
    DOM_plays_display.innerHTML = number_of_plays;
    timer = 0;
    game_state = 'playing';
    start_timer();
}

//-------------------------------------------------------------------------
// Function: count_occurrences_in_array(array, elem)
// Description: Auxiliary function that returns the number of occurrences
//              of an element in an array
//
// Inputs:
// - array: Input array.
// - elem: element to be searched in array.
//
// Outputs: cont (number of occurrences)
//-------------------------------------------------------------------------
function count_occurrences_in_array(array, elem){
    let cont = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] == elem){
            cont ++;
        }
    }
    return cont;
}


//-------------------------------------------------------------------------
// Function: play_sound(sound_type)
// Description: Executes different sound effects depending on input parameter
//
// Inputs: sound_type ('bird', 'correct', 'wrong', 'victory')
//
// Outputs: none
//-------------------------------------------------------------------------
function play_sound(sound_type) {

    let audio = document.createElement('audio');
    switch (sound_type) {
        case 'bird':
            audio.src = sound_effects['bird'];
            audio.volume = sound_volume;
            break;
        case 'correct':
            audio.src = sound_effects['correct'];
            audio.volume = 1;
            break;
        case 'wrong':
            audio.src = sound_effects['wrong'];
            audio.volume = 1;
            break;
        case 'victory':
            audio.src = sound_effects['victory'];
            audio.volume = sound_volume;
            break;
    
        default:
            break;
    }
    if(play_sounds){
        audio.play();
    }
}


//-------------------------------------------------------------------------
// Function: toggle_sound()
// Description: Mutes or un-mutes all sound
//
// Inputs: none
//
// Outputs: none
//-------------------------------------------------------------------------
function toggle_sound() {
    // play_sounds = (play_sounds == true) ? false : true;
    play_sounds = !play_sounds;
    sound_icons = document.querySelectorAll('ion-icon');
    sound_icons[0].classList.toggle('hidden');
    sound_icons[1].classList.toggle('hidden');
    if (play_sounds){
        DOM_sound_status.innerHTML = 'Sound: On';
        DOM_background_music.play();
    }
    else{
        DOM_sound_status.innerHTML = 'Sound: Off';
        DOM_background_music.pause();
    }
}

//-------------------------------------------------------------------------
// Function: start_background_music()
// Description: Initializzes background music
//
// Inputs: none
//
// Outputs: none
//-------------------------------------------------------------------------
function start_background_music() {
    DOM_background_music.currentTime = 0;
    DOM_sound_status.volume = sound_volume;
    DOM_background_music.play();
}

//-------------------------------------------------------------------------
// Function: flip_card(c_i)
// Description: Flips the card by changing css properties of the
//              'card_front_face' and 'card_back_face' divs
//
// Inputs:
// - c_i:  Card index in the 'card_container' div
//
// Outputs: none
//-------------------------------------------------------------------------
function flip_card(c_i) {
    const card_front_face = DOM_cards[c_i].querySelector('.card_front_face')
    const card_back_face = DOM_cards[c_i].querySelector('.card_back_face')

    if (cards_states[c_i] == 'face_down'){
        card_front_face.style.transform='rotateY(0deg)';
        card_back_face.style.transform='rotateY(-180deg)';
    }
    else{
        card_front_face.style.transform='rotateY(180deg)';
        card_back_face.style.transform='rotateY(0deg)';
    }

    
    
}

//-------------------------------------------------------------------------
// Function: update_board_state(card_index)
// Description: Function called whenever user clicks on a card.
//              Performs the necessary game logic and checks
//              if all cards have been correctly guessed.
//
// Inputs:
// - card_index:  Card index corresponding to clicked card
//
// Outputs: none
//-------------------------------------------------------------------------
function update_board_state(card_index) {

    // Card clicked was actually face-down
    if (cards_states[card_index] == 'face_down' && game_state == 'playing'){

        number_of_plays += 1;
        DOM_plays_display.innerHTML = number_of_plays;
        if (number_of_plays == 1){
            start_background_music();
        }

        // No card was being guessed
        if (count_occurrences_in_array(cards_states, 'face_up_guessing') == 0){
            play_sound('bird');
            flip_card(card_index);
            cards_states[card_index] = 'face_up_guessing';
        }

        // 1 Card was already face-up (guessing)
        else if (count_occurrences_in_array(cards_states, 'face_up_guessing') == 1){

            previous_guess_index = cards_states.indexOf('face_up_guessing')

            // Correct Guess
            if (chosen_gif_indexes[card_index] == chosen_gif_indexes[previous_guess_index]){
                play_sound('correct');
                flip_card(card_index);
                cards_states[previous_guess_index] = 'face_up_correct';
                cards_states[card_index] = 'face_up_correct';
            }
            // Incorrect Guess (flip card, wait 1 sec then flip back both guesses)
            else{
                flip_card(card_index);
                cards_states[card_index] = 'face_up_guessing';
                game_state = 'waiting'; // disables clicks on remaining cards while waiting 1s
                setTimeout(function(){
                    flip_card(previous_guess_index);
                    flip_card(card_index);
                    play_sound('wrong');
                    cards_states[previous_guess_index] = 'face_down';
                    cards_states[card_index] = 'face_down';
                    game_state = 'playing';
                }, 1000);
            }
        }
        
        if (count_occurrences_in_array(cards_states, 'face_up_correct') == cards_states.length
            && game_state == 'playing'){
                DOM_background_music.pause();
                play_sound('victory');
                setTimeout(function(){
                    let timer_string = get_time_string(timer);
                    alert(`Voce ganhou em ${number_of_plays} jogadas!\nTempo de jogo ${timer_string}`);
                    game_won();
                }, 500);
            }
        // Check if all cards have been guessed correctly
        
    }
}

//-------------------------------------------------------------------------
// Function: game_won()
// Description: Performs sequence of operations after game is won
//
// Inputs: none
//
// Outputs: none
//-------------------------------------------------------------------------
function game_won(){
    
    game_state = 'won';
    clearInterval(timer_interval);

    const ans = prompt(`Gostaria de reiniciar a partida? ('sim' ou 'não')`);
    if (ans == 'sim'){
        DOM_card_container.innerHTML = '';
        number_of_cards = ask_number_of_cards();
        chosen_gif_indexes = choose_gif_indexes_in_game();
        initialize_game();
    }
    else if (ans == 'não'){
        // Do nothing
    }
    else{
        alert(`Resposta inválida! Digitar 'sim' ou 'não' `);
        game_won();
    }
}


//-------------------------------------------------------------------------
// Function: get_time_string(timer_in_ms)
// Description: Returns a string representing game time
//
// Inputs: timer_in_ms (game time in ms)
//
// Outputs: timer_string
//-------------------------------------------------------------------------
function get_time_string(timer_in_ms) {

    let minutes;
    let seconds;
    let miliseconds;
    let timer_in_s = timer_in_ms/1000;
    minutes = parseInt(timer_in_s / 60, 10);
    seconds = parseInt(timer_in_s % 60, 10);
    miliseconds = parseInt(timer_in_ms % 1000, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    if (miliseconds < 10){
        miliseconds = "00"+miliseconds
    }
    else if (miliseconds < 100){
        miliseconds = "0"+miliseconds
    }
    else{
    }

    let timer_string = minutes + ":" + seconds + ":" + miliseconds;
    return timer_string;

}

//-------------------------------------------------------------------------
// Function: start_timer()
// Description: Starts timer at the beggining of the game and when reset
//
// Inputs: none
//
// Outputs: none
//-------------------------------------------------------------------------
function start_timer() {
    let timer_string;
    timer_interval = setInterval(function () {
        timer_string = get_time_string(timer);
        DOM_timer_display.textContent = timer_string;
        timer += 10;
    }, 10);
}



// -------------------------------- Main --------------------------------

number_of_cards = ask_number_of_cards();
chosen_gif_indexes = choose_gif_indexes_in_game();
initialize_game();






