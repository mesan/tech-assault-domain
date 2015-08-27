import uuid from 'node-uuid';
import pdb from '../../util/pdb';

import boardService from '../../board/services/boardService';
import playerDeckService from '../../player/services/playerPrimaryDeckService';
import battleService from './battleService';

import { getRandomNumber } from '../../util/random';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

export default {

    createMatch(users) {

        const userIds = users.map(user => user.id);

        const [userId1, userId2] = userIds;

        let match;

        // Generate match ID.
        const matchId = uuid.v4();

        // Generate a board instance.
        const board = boardService.createBoard();

        // Calculate first turn.
        const nextTurn = userIds[getRandomNumber(0, 1)];

        // Initialize score.
        const score = [0, 0];

        // Initialize actions.
        const actions = [];

        // Initialize card registry.
        const cards = [];

        // Initialize match state as active.
        const active = true;

        return Promise.all([
            playerDeckService.getPlayerPrimaryDeck(userId1),
            playerDeckService.getPlayerPrimaryDeck(userId2),
            pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'matches')])
            .then(([player1primaryDeck, player2primaryDeck, [db, collection]]) => {

                const primaryDecks = [
                    player1primaryDeck.primaryDeck,
                    player2primaryDeck.primaryDeck
                ];

                match = {
                    matchId,
                    active,
                    board,
                    nextTurn,
                    score,
                    actions,
                    cards,
                    primaryDecks,
                    users
                };

                return collection.insert(match);
            })
            .then(() => {
                match._id = undefined;
                return match;
            });
    },

    getActiveMatchByUserId(userId) {
        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'matches')
            .then(([db, col]) => {
                return col.pfind({ users: { $elemMatch: { id: userId }}, active: true }).toArray();
            })
            .then(docs => docs.length ? docs[0]: undefined);
    },

    performTurn(userId, turn) {
        const { cardId, cardPosition, actionType } = turn;

        let collection;
        let match;

        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'matches')
            .then(([db, col]) => {
                collection = col;
                return collection.pfind({ users: { $elemMatch: { id: userId }}, active: true }).toArray();
            })
            .then(docs => {
                if (!docs.length) {
                    throw 'No active match found!';
                }

                return docs[0];
            })
            .then(activeMatchByUser => {
                match = activeMatchByUser;

                const { nextTurn, users, primaryDecks, board, cards, score } = match;

                // Is it this player's turn?
                if (nextTurn !== userId) {
                    throw 'Not your turn!';
                }

                // Is it a valid card?
                const userIndex = users.map(user => user.id).indexOf(userId);
                const opponentIndex = userIndex === 0 ? 1 : 0;
                const primaryDeck = primaryDecks[userIndex];

                const cardIdIndex = primaryDeck.map(card => card.id).indexOf(cardId);

                const invalidCardId = cardIdIndex === -1;

                if (invalidCardId) {
                    throw `Invalid card ID! (${cardId})`;
                }

                // Is it a valid position on the board?
                const invalidPosition = board[cardPosition] !== 0;

                if (invalidPosition) {
                    throw `Invalid placement of card! (${cardPosition})`;
                }

                // Place card on board.
                match.board[cardPosition] = cardId;

                // Remove placed card from primary deck.
                const [placedCard] = primaryDecks[userIndex].splice(cardIdIndex, 1);

                // Set the card's owner to this player.
                placedCard.owner = userId;

                // Add it to the cards array.
                cards.push(placedCard);

                // Calculate events.
                const battleResults = battleService.performBattles(match.board, match.cards, placedCard, cardPosition);

                const { events } = battleResults;

                // Recalculate players' scores.
                const playerScore = cards.filter(card => card.owner === userId).length;
                const opponentScore = cards.length - playerScore;

                score[userIndex] = playerScore;
                score[opponentIndex] = opponentScore;

                // Set next turn to opponent.
                match.nextTurn = users[opponentIndex].id;

                // Create and add action to match.
                const action = {
                    player: userId,
                    type: actionType,
                    cardId,
                    cardPosition,
                    events
                };

                match.actions.push(action);

                return collection.update({ users: { $elemMatch: { id: userId }}, active: true, nextTurn: userId }, match);
            })
            .then(() => match);
    }
};