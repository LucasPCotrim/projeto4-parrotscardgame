// -------------------------- Global Variables --------------------------

const gif_paths = ['imgs/bobrossparrot.gif',
                   'imgs/explodyparrot.gif',
                   'imgs/fiestaparrot.gif',
                   'imgs/metalparrot.gif',
                   'imgs/revertitparrot.gif',
                   'imgs/tripletsparrot.gif',
                   'imgs/unicornparrot.gif'] // array of gif paths
const gif_indexes = [0,1,2,3,4,5,6]; // array of gif indexes from 'gif_paths'
let number_of_cards; // '4, 6, 8, 10, 12, 14'
let chosen_gif_indexes; // array of length 'number_of_cards' containing non-repeating paired indexes from 0 to 6.
let game_state; // 'playing', 'won'
let cards_states;   // 'face_down', 'face_up_guessing', 'face_up_correct'
let number_of_plays; // number of times user has clicked to flip a card

// DOM objects
const DOM_card_container = document.querySelector('.card_container');
let DOM_cards;

// -------------------------- Functions --------------------------

function ask_number_of_cards() {
    let n_cards;

    let valid_number = false;
    while (valid_number == false){
        n_cards = Number(prompt('Com quantas cartas quer jogar'));
        if (n_cards % 2 == 0 && n_cards >= 4 && n_cards <= 14){
            valid_number = true;
        }
    }

    return n_cards;
}





function comparador() { 
	return Math.random() - 0.5; 
}


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





function fill_cards() {

    for (let i = 0; i < number_of_cards; i++) {
        DOM_card_container.innerHTML += `
                                    <div class="card" data-identifier="card" onclick="update_board_state(${i})">
                                        <div class="card_back_face" data-identifier="back-face">
                                            <img src="imgs/front.png">
                                        </div>
                                        <div class="card_front_face hidden" data-identifier="front-face">
                                            <img src="${gif_paths[chosen_gif_indexes[i]]}">
                                        </div>
                                    </div>
                                    `;
    }
    DOM_cards = document.querySelectorAll('.card');
}



function initialize_game() {

    fill_cards();

    console.log('chosen_gif_indexes')
    console.log(chosen_gif_indexes)

    cards_states = [];

    for (let i = 0; i < number_of_cards; i++) {
        cards_states.push('face_down');
    }
    number_of_plays = 0;
    game_state = 'playing';
}


function count_occurrences_in_array(array, elem){
    let cont = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] == elem){
            cont ++;
        }
    }
    return cont;
}

function flip_card(card_index) {
    DOM_cards[card_index].querySelector('.card_back_face').classList.toggle('hidden');
    DOM_cards[card_index].querySelector('.card_front_face').classList.toggle('hidden');
}



function update_board_state(card_index) {

    console.log('board_state_before:')
    console.log('cards_states')
    console.log(cards_states)

    // Card clicked was actually face-down
    if (cards_states[card_index] == 'face_down' && game_state == 'playing'){
        number_of_plays += 1;

        // 1 Card was already face-up (guessing)
        if (count_occurrences_in_array(cards_states, 'face_up_guessing') == 1){

            previous_guess_index = cards_states.indexOf('face_up_guessing')

            // Correct Guess
            if (chosen_gif_indexes[card_index] == chosen_gif_indexes[previous_guess_index]){
                flip_card(card_index);
                cards_states[previous_guess_index] = 'face_up_correct';
                cards_states[card_index] = 'face_up_correct';
            }
            // Incorrect Guess (flip card, wait 1 sec then flip back both guesses)
            else{
                flip_card(card_index);
                setTimeout(function(){
                    flip_card(previous_guess_index);
                    flip_card(card_index);
                }, 1000);
                cards_states[previous_guess_index] = 'face_down';
                cards_states[card_index] = 'face_down';
            }

        }

        // No card was being guessed
        else if (count_occurrences_in_array(cards_states, 'face_up_guessing') == 0){
            flip_card(card_index);
            cards_states[card_index] = 'face_up_guessing';
        }
    

        
        setTimeout(function(){
            if (count_occurrences_in_array(cards_states, 'face_up_correct') == cards_states.length
                && game_state == 'playing'){
                alert(`Voce ganhou em ${number_of_plays} jogadas!`)
            }
        }, 500);
        

    }
    console.log('board_state_before:')
    console.log('cards_states')
    console.log(cards_states)

    
    
}





// -------------------------- Main --------------------------

number_of_cards = ask_number_of_cards();
chosen_gif_indexes = choose_gif_indexes_in_game();
initialize_game();





