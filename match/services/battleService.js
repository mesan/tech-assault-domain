import gameBoard from './gameBoardService';
import battleEventsCreator from './battleEventsService';

const MAX_ARROW_INDEX_POSITION = 7;

const BATTLE_EVENT = "battle";
const TAKEOVER_EVENT = "takeOver";

export default {

    performBattles(board, cards, placedCard, cardPosition) {
        // For testing purposes
        board[cardPosition] = placedCard.id;

        let gameboard = gameBoard(board, cards);
        let events = [];

        let opposingCardLocation = gameboard.findConnectedCards(cardPosition).next();
        while(opposingCardLocation.done !== true) {
            // Battle and store events
            events = performBattle(gameboard, placedCard, cardPosition, opposingCardLocation.value);

            // Find next opposing card to battle
            opposingCardLocation = gameboard.findConnectedCards(cardPosition).next();
        }

        return { cards, events };
    }
}

function performBattle (gameboard, playerCard, playerCardPosition, opposingCardLocation) {
    let events = [];
    let opposingCard = opposingCardLocation.card;
    let opposingCardPosition = opposingCardLocation.gameBoardIndex;
    let playerCardArrowIndex = opposingCardLocation.playerCardArrowIndex;

    if (isOpposingCardPointingToPlayer(playerCardArrowIndex, opposingCard)) {
        // Do battle
        let battleResult = battle(playerCard, opposingCard);

        // Find all opponent cards connected by arrows to the opposing card.
        // These will be awarded as combos if the player wins the battle.
        let cardsConnectedToOpposingPlayerCard = gameboard.findOpposingCardsPointedToBy(
            opposingCardPosition, opposingCardLocation.card.owner);

        // create events
        let battleEvents = battleEventsCreator.createBattleEvent(battleResult, playerCardPosition, opposingCardPosition);
        let comboEvents = battleEventsCreator.createComboTakeovers(battleResult, cardsConnectedToOpposingPlayerCard);

        events = events.concat(battleEvents, comboEvents);
    }
    else {
        // Opposing card is not pointing back at player card.
        // Generates a takeover for the player
        let takeoverEvent = battleEventsCreator.createTakeoverEvent(opposingCard, opposingCardPosition, playerCard.owner);
        events.push(takeoverEvent);
    }

    // Update owner on cards based on takeOver events
    events.filter(event => event.type === TAKEOVER_EVENT)
          .forEach(takeover => gameboard.updateOwnerOnCard(takeover.cardId, takeover.newOwner));

    return events;
};

function battle(playerCard, opponentCard) {
    let attackValue = calculateAttributeValueForBattle(playerCard.attack);
    let defenseValue = calculateAttributeValueForBattle(opponentCard.defense);

    return {
        "attacker": playerCard,
        "defender": opponentCard,
        "attackValue": attackValue,
        "defenseValue": defenseValue,
        "winner": (attackValue >= defenseValue) ? playerCard.owner : opponentCard.owner
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

    if (position > MAX_ARROW_INDEX_POSITION) {
        position = position - 8;
    }

    return opposingCard.arrows[position] === 1;
};
