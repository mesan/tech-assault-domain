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

        let connectedOpposingCard = gameboard.findConnectedCards(cardPosition);
        let opposingCardLocation = connectedOpposingCard.next();
        let player = placedCard.owner;
        let battleOutcome = {};

        while(hasMoreConnectedOpposingCards(opposingCardLocation) && isPlayerWinnerOfBattle(player, battleOutcome.result)) {
            // Battle and store events
            battleOutcome = performBattle(gameboard, placedCard, cardPosition, opposingCardLocation.value);
            events = events.concat(battleOutcome.events);

            // Find next opposing card to battle
            opposingCardLocation = connectedOpposingCard.next();
        }

        return { cards, events };
    }
}

function performBattle (gameboard, playerCard, playerCardPosition, opposingCardLocation) {
    let events = [];
    let opposingCard = opposingCardLocation.card;
    let opposingCardPosition = opposingCardLocation.gameBoardIndex;
    let playerCardArrowIndex = opposingCardLocation.playerCardArrowIndex;
    let battleResult;

    if (isOpposingCardPointingToPlayer(playerCardArrowIndex, opposingCard)) {
        // Do battle
        battleResult = battle(playerCard, opposingCard);

        let looser = findLoosingPlayerAndPosition(battleResult, playerCardPosition, opposingCardPosition);

        //let loosingCardPosition = (battleResult.winner === playerCard.owner) ? opposingCardPosition : playerCardPosition;
        let connectedCards = gameboard.findOpposingCardsPointedToBy(
            looser.loosingCardPosition, looser.loosingPlayerName);

        // create events
        let battleEvents = battleEventsCreator.createBattleEvent(battleResult, playerCardPosition, opposingCardPosition);
        let comboEvents = battleEventsCreator.createComboTakeovers(battleResult, connectedCards);

        events = events.concat(battleEvents, comboEvents);
    }
    else {
        // Opposing card is not pointing back at player card.
        // Generates a takeover for the player
        let takeoverEvent = battleEventsCreator.createTakeoverEvent(opposingCard.id, opposingCardPosition, playerCard.owner);

        events.push(takeoverEvent);
    }

    // Update owner on cards based on takeOver events
    events.filter(event => event.type === TAKEOVER_EVENT)
          .forEach(takeover => gameboard.updateOwnerOnCard(takeover.cardId, takeover.newOwner));

    return {
        result: battleResult,
        events: events
    };
};

function findLoosingPlayerAndPosition(battleResult, playerCardPosition, opposingCardPosition) {
    let loosingCardPosition;
    let loosingPlayerName;
    if (battleResult.winner === battleResult.attacker.owner) {
        loosingCardPosition = opposingCardPosition;
        loosingPlayerName = battleResult.defender.owner;
    }
    else {
        loosingCardPosition = playerCardPosition;
        loosingPlayerName = battleResult.attacker.owner;
    }

    return {
        loosingCardPosition,
        loosingPlayerName
    }
}

function hasMoreConnectedOpposingCards (opposingCardLocation) {
    return opposingCardLocation.done !== true;
};

function isPlayerWinnerOfBattle (player, battleOutcome) {
    if (typeof battleOutcome === 'undefined') {
        return true;
    }

    return (player === battleOutcome.winner) ? true : false;
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
