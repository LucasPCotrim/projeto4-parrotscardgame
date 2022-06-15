// -------------------------- Global Variables --------------------------

const gif_paths = ['imgs/bobrossparrot.gif',
                   'imgs/explodyparrot.gif',
                   'imgs/fiestaparrot.gif',
                   'imgs/metalparrot.gif',
                   'imgs/revertitparrot.gif',
                   'imgs/tripletsparrot.gif',
                   'imgs/unicornparrot.gif']
const gif_indexes = [0,1,2,3,4,5,6];
const card_container = document.querySelector('.card_container');
let number_of_cards;


// -------------------------- Functions --------------------------

function ask_number_of_cards(){
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




function choose_gif_indexes_in_game(n_cards){

    let chosen_gif_indexes = [];
    let randomized_gif_indexes = [];

    for (let i = 0; i < gif_indexes.length; i++) {
        randomized_gif_indexes.push(gif_indexes[i]);
    }
    randomized_gif_indexes.sort(comparador);

    for (let i = 0; i < n_cards/2; i++) {
        chosen_gif_indexes.push(randomized_gif_indexes[i]);
        chosen_gif_indexes.push(randomized_gif_indexes[i]);
    }
    chosen_gif_indexes.sort(comparador);

    return chosen_gif_indexes;
}





function fill_cards (n_cards){

    let chosen_gif_indexes = choose_gif_indexes_in_game(n_cards);

    for (let i = 0; i < n_cards; i++) {
        card_container.innerHTML += `
                                    <div class="card" data-identifier="card">
                                        <div class="card_back_face">
                                            <img src="imgs/front.png">
                                        </div>
                                        <div class="card_front_face">
                                            <img src="${gif_paths[chosen_gif_indexes[i]]}">
                                        </div>
                                    </div>
                                    `;
    }
}





// -------------------------- Main --------------------------

number_of_cards = ask_number_of_cards();
fill_cards(number_of_cards);





