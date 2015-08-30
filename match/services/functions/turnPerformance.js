import battleService from '../battleService';

export default function turnPerformance(userId, turn, pdb) {

    const { cardId, cardPosition, actionType } = turn;

    return {
        placeCardOnBoard(match) {
            const { board, cards, primaryDecks, users } = match;

            const userIndex = users.map(user => user.id).indexOf(userId);
            const primaryDeck = primaryDecks[userIndex];
            const cardIdIndex = primaryDeck.map(card => card.id).indexOf(cardId);

            // Place card on board.
            board[cardPosition] = cardId;

            // Remove placed card from primary deck.
            const [placedCard] = primaryDeck.splice(cardIdIndex, 1);

            // Set the card's owner to this player.
            placedCard.owner = userId;

            // Add it to the cards array.
            cards.push(placedCard);

            return match;
        },

        performAction(match) {
            // Calculate events.
            const { board, cards } = match;

            const placedCard = cards.filter(card => cardId === card.id)[0];

            const battleResults = battleService.performBattles(board, cards, placedCard, cardPosition);

            const { events } = battleResults;

            // Create and add action to match.
            const action = {
                player: userId,
                type: actionType,
                cardId,
                cardPosition,
                events
            };

            match.actions.push(action);

            return match;
        },

        recalculateScore(match) {
            const { users, score, cards } = match;

            const userIndex = users.map(user => user.id).indexOf(userId);
            const opponentIndex = userIndex === 1 ? 0 : 1;

            // Recalculate players' scores.
            const playerScore = cards.filter(card => card.owner === userId).length;
            const opponentScore = cards.length - playerScore;

            score[userIndex] = playerScore;
            score[opponentIndex] = opponentScore;

            return match;
        },

        toggleNextTurn(match) {
            const { users } = match;

            const userIndex = users.map(user => user.id).indexOf(userId);
            const opponentIndex = userIndex === 1 ? 0 : 1;

            // Set next turn to opponent.
            match.nextTurn = users[opponentIndex].id;

            return match;
        },

        setMatchFinishedState(match) {
            const [ primaryDeck1, primaryDeck2 ] = match.primaryDecks;

            match.finished = primaryDeck1.length === 0 && primaryDeck2.length === 0;

            return match;
        },

        setCardsToLoot(match) {
            if (!match.finished) {
                return match;
            }

            const { users, score, cards, originalPrimaryDecks } = match;
            const [ score1, score2 ] = score;

            // Will hold the cards that the winner may loot.
            let cardsToLoot = [];

            // Will eventually hold the card(s) the winner actually looted.
            let cardsLooted = [];

            if (score1 !== score2) {
                const winnerIndex = score1 > score2 ? 0 : 1;
                const loserIndex = winnerIndex === 0 ? 1 : 0;
                const winningUserId = users[winnerIndex].id;
                const originalPrimaryDeck = originalPrimaryDecks[winnerIndex];

                cardsToLoot = cards
                    .filter(card => card.owner === winningUserId && originalPrimaryDeck.indexOf(card.id) === -1)
                    .map(card => card.id);

                // If winner gets a perfect victory, he automatically gets the loser's entire primary deck!
                if (score[loserIndex] === 0) {
                    cardsLooted = originalPrimaryDecks[loserIndex];
                }
            }

            match.cardsToLoot = cardsToLoot;
            match.cardsLooted = cardsLooted;

            return match;
        }
    };
}