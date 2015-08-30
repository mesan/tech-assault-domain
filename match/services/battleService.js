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
        let events = [];

        battles.forEach(function(battle) {
            let opposingCard = battle.card;
            let arrowPositionPointingToOppsosingCard = battle.arrowIndex;

            // Is enemy card pointing to the player card
            if (isOppsingCardPointingToPlayer(arrowPositionPointingToOppsosingCard, opposingCard)) {
                console.log("BATTLE!!!");
                let outcome = engine(placedCard, battle.card);
                console.log("WINNER: " + outcome.winner);

                events.push({
                    type : "battle",
                    opposingCardId : opposingCard.id,
                    cardPower: outcome.attackValue,
                    opposingCardPower: outcome.defenseValue
                });
            }
            else {
                events.push({
                    type : "takeover",
                    newOwner : placedCard.owner,
                    cardId : opposingCard.id,
                    cardPosition: battle.boardIndex
                });
            }

        });
/*

        "events": [
            {
                "type": "battle",
                "opposingCardId": "2a5f316e-b55f-4c3d-866b-2c27737b5cd5",
                "opposingCardPosition": 10,
                "cardPower": 123,
                "opposingCardPower": 118
            },
            {
                "type": "takeOver",
                "newOwner": "tw-123",
                "cardId": "2a5f316e-b55f-4c3d-866b-2c27737b5cd5",
                "cardPosition": 10
            },
*/


        return {
            events: events
        };
    }
}
