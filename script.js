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
let cards_states;   // 'face_down', 'face_up_guessing', 'face_up_correct'


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
                                    <div class="card" data-identifier="card" onclick="flip_card(${i})">
                                        <div class="card_back_face">
                                            <img src="imgs/front.png">
                                        </div>
                                        <div class="card_front_face hidden">
                                            <img src="${gif_paths[chosen_gif_indexes[i]]}">
                                        </div>
                                    </div>
                                    `;
    }
    DOM_cards = document.querySelectorAll('.card');
}



function initialize_game() {
    for (let i = 0; i < number_of_cards; i++) {
        cards_states.push('face_down');
    }
}


function flip_card(card_index) {
    DOM_cards[card_index].querySelector('.card_back_face').classList.toggle('hidden');
    DOM_cards[card_index].querySelector('.card_front_face').classList.toggle('hidden');
}



// -------------------------- Main --------------------------

number_of_cards = ask_number_of_cards();
chosen_gif_indexes = choose_gif_indexes_in_game();
fill_cards();





