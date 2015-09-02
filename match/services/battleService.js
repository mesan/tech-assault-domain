import engine from '../../engine/gameEngine';
import GameBoard from './gameBoardService';

var isOpposingCardPointingToPlayer = function (arrowPositionPointingToOpposingCard, opposingCard) {
    let position = arrowPositionPointingToOpposingCard + 4;

    if (position > 7) {
        position = position - 8;
    }

    return opposingCard.arrows[position] === 1;
}

export default {
    performBattles(board, cards, placedCard, cardPosition) {
        // For testing purposes
        board[cardPosition] = placedCard.id;

        let gameboard = GameBoard(board, cards);
        let events = [];


        let opposingCardLocation = gameboard.find(cardPosition);

        while(opposingCardLocation != true) {
            let opposingCard = opposingCardLocation.card;

            let battle = undefined;
            if (isOpposingCardPointingToPlayer(opposingCardLocation.arrowIndex, opposingCard)) {
                battle = engine(placedCard, opposingCard);

                events.push({
                    type: "battle",
                    cardId: placedCard.id,
                    cardPosition: cardPosition,
                    opposingCardId: opposingCard.id,
                    opposingCardPosition: opposingCardLocation.boardIndex,
                    cardPower: battle.attackValue,
                    opposingCardPower: battle.defenseValue
                });

                if (battle.winner === opposingCard.owner) {
                    events.push({
                        type : "takeOver",
                        newOwner : opposingCard.owner,
                        cardId : placedCard.id,
                        cardPosition: cardPosition
                    });

                    break;
                }
                else {
                    events.push({
                        type : "takeOver",
                        newOwner : placedCard.owner,
                        cardId : opposingCard.id,
                        cardPosition: opposingCardLocation.boardIndex
                    });

                    gameboard.updateOwnerOnCard(opposingCard.id, placedCard.owner);

                    let comboTakeovers = gameboard.findOpposingCardsPointedToBy(opposingCardLocation.boardIndex);

                    for (let comboIndex = 0; comboIndex < comboTakeovers.length; comboIndex++) {
                        let combo = comboTakeovers[comboIndex];

                        events.push({
                            type: "takeOver",
                            newOwner: placedCard.owner,
                            cardId: combo.card.id,
                            cardPosition: combo.boardIndex
                        });

                        gameboard.updateOwnerOnCard(combo.card.id, placedCard.owner);
                    }
                }
            }
            else {
                events.push({
                    type : "takeOver",
                    newOwner : placedCard.owner,
                    cardId : opposingCard.id,
                    cardPosition: opposingCardLocation.boardIndex
                });
            }

            opposingCardLocation = gameboard.find(cardPosition);
        }

        return { cards, events };
    }
}
