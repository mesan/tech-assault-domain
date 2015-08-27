import uuid from 'node-uuid';
import pdb from '../../util/pdb';

import boardService from '../../board/services/boardService';
import playerDeckService from '../../player/services/playerPrimaryDeckService';
import battleService from './battleService';

import findActiveMatch from '../repositories/findActiveMatch';
import updateActiveMatch from '../repositories/updateActiveMatch';

import turnPerformance from './functions/turnPerformance';
import turnValidation from './functions/turnValidation';

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
        return findActiveMatch(userId);
    },

    performTurn(userId, turn) {
        const {
            validateActiveMatchExists,
            validatePlayerTurn,
            validateCard,
            validatePosition
            } = turnValidation(userId, turn);

        const {
            placeCardOnBoard,
            performAction,
            recalculateScore,
            toggleNextTurn
            } = turnPerformance(userId, turn, pdb);

        return findActiveMatch(userId)
            .then(validateActiveMatchExists)
            .then(validatePlayerTurn)
            .then(validateCard)
            .then(validatePosition)
            .then(placeCardOnBoard)
            .then(performAction)
            .then(recalculateScore)
            .then(toggleNextTurn)
            .then(updateActiveMatch);
    }
};