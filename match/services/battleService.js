import engine from '../../engine/gameEngine';
import gameBoard from './gameBoardService';

var isOppsingCardPointingToPlayer = function (arrowPositionPointingToOppsosingCard, opposingCard) {
    let position = arrowPositionPointingToOppsosingCard + 4;

    if (position > 7) {
        position = position - 7;
    }

    return opposingCard.arrows[position] === 1;
}

export default {
    performBattles(board, cards, placedCard, cardPosition) {

        let battles = gameBoard(board, cards).findBattlingCards(placedCard, cardPosition);

     /*   if (typeof gameboard.toCoords(16) === 'undefined') {
            console.log("coords is out of bounds!");
        }
        if (typeof gameboard.toIndex([5,3]) === "undefined") {
            console.log("index is out of bounds");
        }*/
        //let battles = gameboard.findBattlingCards(placedCard, cardPosition);

        battles.forEach(function(battle) {
            let opposingCard = battle.card;
            let arrowPositionPointingToOppsosingCard = battle.arrowIndex;

            // Is enemy card pointing to the player card
            if (isOppsingCardPointingToPlayer(arrowPositionPointingToOppsosingCard, opposingCard)) {
                console.log("BATTLE!!!");
                let outcome = engine(placedCard, battle.card);
                console.log("WINNER: " + outcome.winner);
            }
            else {
                console.log("TAKES IT!");
            }

        });


        return {
            events: []
        };
    }
}
