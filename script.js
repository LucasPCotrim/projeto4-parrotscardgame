const gif_paths = ['imgs/bobrossparrot.gif',
                   'imgs/explodyparrot.gif',
                   'imgs/fiestaparrot.gif',
                   'imgs/metalparrot.gif',
                   'imgs/revertitparrot.gif',
                   'imgs/tripletsparrot.gif',
                   'imgs/unicornparrot.gif']

function ask_number_of_cards(){
    let number_of_cards;

    let valid_number = false;
    while (valid_number == false){
        number_of_cards = Number(prompt('Com quantas cartas quer jogar'));
        console.log(number_of_cards);
        if (number_of_cards % 2 == 0){
            valid_number = true;
        }
    }

    return number_of_cards;
}

let number_of_cards = ask_number_of_cards()

