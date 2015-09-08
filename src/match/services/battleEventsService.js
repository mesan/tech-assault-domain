
const BATTLE_EVENT = "battle";
const TAKEOVER_EVENT = "takeOver";

let battleEventsService = {

    createBattleEvent(battleResult, playerCardPosition, opposingCardPosition) {
        let cardWonPosition;
        let cardWonId;
        let newOwner = battleResult.winner;

        if (battleResult.winner === battleResult.attacker.owner) {
            cardWonPosition = opposingCardPosition;
            cardWonId = battleResult.defender.id;
        }
        else {
            cardWonPosition = playerCardPosition;
            cardWonId = battleResult.attacker.id;
        }

        let takeoverEvent = this.createTakeoverEvent(cardWonId, cardWonPosition, newOwner);

        let battleEvent = {
            type: BATTLE_EVENT,
            cardId: battleResult.attacker.id,
            cardPosition: playerCardPosition,
            opposingCardId: battleResult.defender.id,
            opposingCardPosition: opposingCardPosition,
            cardPower: battleResult.attackValue,
            opposingCardPower: battleResult.defenseValue
        }

        return [
            battleEvent,
            takeoverEvent];
    },

    createTakeoverEvent(cartId, cardPosition, newOwner) {
        return {
            type : TAKEOVER_EVENT,
            newOwner : newOwner,
            cardId : cartId,
            cardPosition: cardPosition
        };
    },

    createComboTakeovers(battleResult, connectedCards) {
        let player = battleResult.winner;

        let events = connectedCards.map((combo) => {
            return this.createTakeoverEvent(combo.card.id, combo.boardIndex, player)
        });

        return events;
    }

}

function findWinner() {

}

export default battleEventsService;


