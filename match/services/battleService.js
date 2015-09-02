import GameBoard from './gameBoardService';

export default {
    performBattles(board, cards, placedCard, cardPosition) {
        // For testing purposes
        board[cardPosition] = placedCard.id;

        let gameboard = GameBoard(board, cards);
        let events = [];


        let opposingCardLocation = gameboard.find(cardPosition);

        while(opposingCardLocation != true) {
            let opposingCard = opposingCardLocation.card;

            let battleResult = undefined;
            if (isOpposingCardPointingToPlayer(opposingCardLocation.arrowIndex, opposingCard)) {
                battleResult = battle(placedCard, opposingCard);

                events.push({
                    type: "battle",
                    cardId: placedCard.id,
                    cardPosition: cardPosition,
                    opposingCardId: opposingCard.id,
                    opposingCardPosition: opposingCardLocation.boardIndex,
                    cardPower: battleResult.attackValue,
                    opposingCardPower: battleResult.defenseValue
                });

                if (battleResult.winner === opposingCard.owner) {
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

                gameboard.updateOwnerOnCard(opposingCard.id, placedCard.owner);
            }

            opposingCardLocation = gameboard.find(cardPosition);
        }

        return { cards, events };
    }
}

function battle(playerCard, opponentCard) {
    let attackValue = calculateAttributeValueForBattle(playerCard.attack);
    let defenseValue = calculateAttributeValueForBattle(opponentCard.defense);

    return {
        "attacker": playerCard,
        "defender": opponentCard,
        "attackValue": attackValue,
        "defenseValue": defenseValue,
        "winner": (attackValue > defenseValue) ? playerCard.owner : opponentCard.owner
    };
};

function calculateAttributeValueForBattle(cardAttributeValue) {
    let attributeRange = findIntervalRangeFromValue(cardAttributeValue);

    let attributeValue = randomValueFromInterval(
        attributeRange.min,
        attributeRange.max);

    let penaltyValue = randomValueFromInterval(0, attributeValue);

    return attributeValue - penaltyValue;
};

function findIntervalRangeFromValue(value) {
    return {
        min: value * 10,
        max: (value * 10) + 9
    }
};

function randomValueFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function isOpposingCardPointingToPlayer (arrowPositionPointingToOpposingCard, opposingCard) {
    let position = arrowPositionPointingToOpposingCard + 4;

    if (position > 7) {
        position = position - 8;
    }

    return opposingCard.arrows[position] === 1;
};
