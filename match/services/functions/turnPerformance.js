import battleService from '../battleService';

export default function turnPerformance(userId, turn) {

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

        performPlayerAction(match) {
            // Calculate events.
            const { board, cards } = match;

            const placedCard = cards.filter(card => cardId === card.id)[0];

            const battleResults = battleService.performBattles(board, cards, placedCard, cardPosition);

            const { cards: newCards, events } = battleResults;

            match.cards = newCards;

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

        setMatchFinishedStateUnconditionally(match) {
            match.finished = true;

            return match;
        },

        setMatchWinner(match) {
            if (!match.finished) {
                return match;
            }

            const { users, score } = match;

            match.winner = score[0] === score[1]
                ? 'N/A'
                : score[0] > score[1]
                    ? users[0].id
                    : users[1].id;

            return match;
        },

        setMatchWinnerIfTimeout(match) {
            const { users, nextTurn } = match;

            const winnerIndex = users.findIndex(user => user.id !== nextTurn);
            const winnerId = users[winnerIndex].id;

            match.winner = winnerId;

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
                const winningUserId = users[winnerIndex].id;
                const originalPrimaryDeck = originalPrimaryDecks[winnerIndex];

                // Loop through all cards on the board and filter out all cards not belonging to winner and which the
                // winner not already owned before the match.
                cardsToLoot = cards
                    .filter(card => card.owner === winningUserId && originalPrimaryDeck.indexOf(card.id) === -1)
                    .map(card => card.id);
            }

            match.cardsToLoot = cardsToLoot;

            return match;
        },

        setCardsToLootIfTimeout(match) {
            const { users, cards, winner, originalPrimaryDecks } = match;

            const winnerIndex = users.findIndex(user => user.id === winner);
            const winnerId = users[winnerIndex].id;
            const winnerOriginalPrimaryDeck = originalPrimaryDecks[winnerIndex];

            // Loop through all cards on the board and filter out all cards which the winner not already owned before
            // the match.
            match.cardsToLoot = cards
                .filter(card => card.owner === winnerId && winnerOriginalPrimaryDeck.indexOf(card.id) === -1)
                .map(card => card.id);

            return match;
        },

        lootCardsAutomaticallyIfPerfectVictoryOrOnlyOneCardToLoot(match) {
            const { primaryDecks, score, originalPrimaryDecks, users, winner } = match;

            if (typeof winner === 'undefined' || winner === 'N/A') {
                return match;
            }

            if (match.finished) {
                const loserIndex = users.findIndex(user => user.id !== winner);

                if (score[loserIndex] === 0 || (match.cardsToLoot && match.cardsToLoot.length === 1)) {
                    // If winner gets a perfect victory, he automatically gets all the loser's cards!
                    // If winner can loot only one card, he will automatically loot it for sake of convenience.
                    match.cardsLooted = match.cardsToLoot;
                }
            }

            return match;
        },

        setMatchToInactiveIfNoCardsToLootOrCardsHaveBeenLooted(match) {
            if (match.finished) {
                if (!match.cardsToLoot || match.cardsToLoot.length === 0) {
                    match.active = false;
                }

                if (match.cardsLooted && match.cardsLooted.length > 0) {
                    match.active = false;
                }
            }

            return match;
        },

        setTurnTimedOut(match) {
            match.turnTimedOut = true;

            return match;
        },

        setMatchToInactiveIfDraw(match) {
            if (match.finished && match.winner === 'N/A') {
                match.active = false;
            }

            console.log('ifdraw');

            return match;
        }
    };
}