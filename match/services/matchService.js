import uuid from 'node-uuid';
import pdb from '../../util/pdb';
import tap from '../../util/tap';

import boardService from '../../board/services/boardService';
import playerPrimaryDeckService from '../../player/services/playerPrimaryDeckService';
import battleService from './battleService';

import getActiveMatch from './repositories/getActiveMatch';
import updateActiveMatchWithTurn from './repositories/updateActiveMatchWithTurn';
import updateActiveMatchByWinner from './repositories/updateActiveMatchByWinner';
import updateActiveMatchByUser from './repositories/updateActiveMatchByUser';
import updateActiveMatchWithTimeoutAndCardsToLoot from './repositories/updateActiveMatchWithTimeoutAndCardsToLoot';
import updatePlayerDecksIfCardsAreLooted from './repositories/updatePlayerDecksIfCardsAreLooted';

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
            playerPrimaryDeckService.getPlayerPrimaryDeck(userId1),
            playerPrimaryDeckService.getPlayerPrimaryDeck(userId2),
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
            validateActiveMatchExists,
            validateMatchIsNotFinished
            } = matchValidation();

        const {
            validatePlayerTurn,
            validateCard,
            validatePosition
            } = turnValidation(userId, turn);

        const {
            placeCardOnBoard,
            performPlayerAction,
            recalculateScore,
            toggleNextTurn,
            setMatchFinishedState,
            setMatchWinner,
            setCardsToLoot,
            lootCardsAutomaticallyIfPerfectVictoryOrOnlyOneCardToLoot,
            setMatchToInactiveIfDraw,
            setMatchToInactiveIfNoCardsToLootOrCardsHaveBeenLooted
            } = turnPerformance(userId, turn);

        return getActiveMatch(userId)
            .then(validateActiveMatchExists)
            .then(validateMatchIsNotFinished)
            .then(validatePlayerTurn)
            .then(validateCard)
            .then(validatePosition)
            .then(placeCardOnBoard)
            .then(performPlayerAction)
            .then(recalculateScore)
            .then(toggleNextTurn)
            .then(setMatchFinishedState)
            .then(setMatchWinner)
            .then(setCardsToLoot)
            .then(lootCardsAutomaticallyIfPerfectVictoryOrOnlyOneCardToLoot)
            .then(setMatchToInactiveIfNoCardsToLootOrCardsHaveBeenLooted)
            .then(setMatchToInactiveIfDraw)
            .then(updateActiveMatchWithTurn)
            .then(updatePlayerDecksIfCardsAreLooted);
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
            .then(updatePlayerDecksIfCardsAreLooted);
    },

    timeOutTurn(userId) {
        const {
            validateActiveMatchExists
            } = matchValidation();

        const {
            validatePlayerTurn,
            } = turnValidation(userId, {});

        const {
            setMatchFinishedStateUnconditionally,
            setCardsToLootIfTimeout,
            lootCardsAutomaticallyIfPerfectVictoryOrOnlyOneCardToLoot,
            setTurnTimedOut,
            setMatchWinnerIfTimeout,
            setMatchToInactiveIfNoCardsToLootOrCardsHaveBeenLooted
            } = turnPerformance(userId, {});

        return getActiveMatch(userId)
            .then(validateActiveMatchExists)
            .then(validatePlayerTurn)
            .then(setTurnTimedOut)
            .then(setMatchFinishedStateUnconditionally)
            .then(setMatchWinnerIfTimeout)
            .then(setCardsToLootIfTimeout)
            .then(lootCardsAutomaticallyIfPerfectVictoryOrOnlyOneCardToLoot)
            .then(setMatchToInactiveIfNoCardsToLootOrCardsHaveBeenLooted)
            .then(updateActiveMatchWithTimeoutAndCardsToLoot)
            .then(updatePlayerDecksIfCardsAreLooted);
    },

    timeOutLooting(userId) {
        const {
            validateActiveMatchExists,
            validateMatchIsFinished
            } = matchValidation();

        const {
            setMatchToInactive,
            setLootTimedOut,
            } = lootPerformance(userId, {});

        return getActiveMatch(userId)
            .then(validateActiveMatchExists)
            .then(validateMatchIsFinished)
            .then(setMatchToInactive)
            .then(setLootTimedOut)
            .then(updateActiveMatchByUser);
    }
};