import uuid from 'node-uuid';
import pdb from '../../util/pdb';

import boardService from '../../board/services/boardService';
import playerDeckService from '../../player/services/playerPrimaryDeckService';
import battleService from './battleService';

import getActiveMatch from './repositories/getActiveMatch';
import updateActiveMatchWithTurn from './repositories/updateActiveMatchWithTurn';
import updateActiveMatchByWinner from './repositories/updateActiveMatchByWinner';
import updatePlayerDecks from './repositories/updatePlayerDecks';

import turnPerformance from './functions/turnPerformance';
import matchValidation from './functions/matchValidation';
import turnValidation from './functions/turnValidation';
import lootValidation from './functions/lootValidation';
import lootPerformance from './functions/lootPerformance';

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

        // Initialize match as active.
        const active = true;

        // Initialize match state as not finished.
        const finished = false;

        return Promise.all([
            playerDeckService.getPlayerPrimaryDeck(userId1),
            playerDeckService.getPlayerPrimaryDeck(userId2),
            pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'matches')])
            .then(([player1primaryDeck, player2primaryDeck, [db, collection]]) => {

                const primaryDecks = [
                    player1primaryDeck.primaryDeck,
                    player2primaryDeck.primaryDeck
                ];

                const originalPrimaryDecks = primaryDecks.map(primaryDeck => primaryDeck.map(card => card.id));

                match = {
                    matchId,
                    active,
                    board,
                    nextTurn,
                    score,
                    actions,
                    cards,
                    primaryDecks,
                    originalPrimaryDecks,
                    users,
                    finished
                };

                return collection.insert(match);
            })
            .then(() => {
                match._id = undefined;
                return match;
            });
    },

    getActiveMatchByUserId(userId) {
        return getActiveMatch(userId);
    },

    performTurn(userId, turn) {
        const {
            validateActiveMatchExists
            } = matchValidation();

        const {
            validatePlayerTurn,
            validateCard,
            validatePosition
            } = turnValidation(userId, turn);

        const {
            placeCardOnBoard,
            performAction,
            recalculateScore,
            toggleNextTurn,
            setMatchFinishedState,
            setMatchWinner,
            setCardsToLoot,
            setMatchToInactiveIfDraw
            } = turnPerformance(userId, turn, pdb);

        return getActiveMatch(userId)
            .then(validateActiveMatchExists)
            .then(validatePlayerTurn)
            .then(validateCard)
            .then(validatePosition)
            .then(placeCardOnBoard)
            .then(performAction)
            .then(recalculateScore)
            .then(toggleNextTurn)
            .then(setMatchFinishedState)
            .then(setMatchWinner)
            .then(setCardsToLoot)
            .then(setMatchToInactiveIfDraw)
            .then(updateActiveMatchWithTurn);
    },

    performLoot(userId, loot) {
        const {
            validateActiveMatchExists,
            validateMatchIsFinished
            } = matchValidation();

        const {
            validatePlayerIsWinner,
            validateLootedCard
            } = lootValidation(userId, loot);

        const {
            setCardToLoot,
            setMatchToInactive
            } = lootPerformance(userId, loot);

        return getActiveMatch(userId)
            .then(validateActiveMatchExists)
            .then(validateMatchIsFinished)
            .then(validatePlayerIsWinner)
            .then(validateLootedCard)
            .then(setCardToLoot)
            .then(setMatchToInactive)
            .then(updateActiveMatchByWinner)
            .then(updatePlayerDecks);
    }
};