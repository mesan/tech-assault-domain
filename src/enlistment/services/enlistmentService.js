import pdb from '../../util/pdb';
import uuid from 'node-uuid';
import { getRandomNumbers } from '../../util/random';
import tap from '../../util/tap';

import matchService from '../../match/services/matchService';
import playerDeckService from '../../player/services/playerDeckService';

import matchValidation from './functions/matchValidation';
import playerPrimaryDeckValidation from './functions/playerPrimaryDeckValidation';
import insertEnlistment from './repositories/insertEnlistment';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

let enlistmentService = {

    /**
     * Adds a player to the enlistment collection.
     */
    enlistPlayer(userId, userToken) {
        const {
            validateActiveMatchDoesNotExist
            } = matchValidation();

        const {
            validatePlayerPrimaryDeckIsComplete
            } = playerPrimaryDeckValidation();

        return matchService.getActiveMatchByUserId(userId)
            .then(tap(validateActiveMatchDoesNotExist, userId))
            .then(playerDeckService.getPlayerDeck)
            .then(tap(validatePlayerPrimaryDeckIsComplete, { userId, userToken }))
            .then(insertEnlistment);
    },

    /**
     * Removes a player from the enlistment collection.
     */
    withdrawPlayer(userToken) {
        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'enlistments')
            .then(([db, collection]) => {
                return collection.remove({ userToken });
            });
    },

    /**
     * Finds unprocessed player enlistments and matches these players against each other, one-on-one. Once processed,
     * the enlistments are removed from the collection.
     */
    matchEnlistedPlayers() {
        let matches = [];

        let collection;

        const readerId = uuid.v4();

        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'enlistments')
            .then(([db, col]) => {
                collection = col;

                return collection.pfind({ readerId: { $exists: false }}).toArray();
            })
            .then((enlistments) => {
                const enlistmentIds = enlistments.map(enlistment => enlistment._id);

                return collection.update(
                    { _id: { $in: enlistmentIds }},
                    { $set: { readerId }},
                    { multi: true });
            })
            .then((writeObject) => {
                return collection.pfind({ readerId }).toArray();
            })
            .then((enlistments) => {
                while (enlistments.length > 1) {
                    const selectedIndices = getRandomNumbers(0, enlistments.length - 1, 2, true);

                    const selectedOpponents = selectedIndices.map((selectedIndex) => {
                        return enlistments[selectedIndex].userToken;
                    });

                    enlistments = enlistments.filter((enlistment, enlistmentIndex) => {
                        return selectedIndices.indexOf(enlistmentIndex) === -1
                    });

                    matches.push(selectedOpponents);
                }

                if (enlistments.length > 0) {
                    const enlistmentIds = enlistments.map(enlistment => enlistment._id);

                    return Promise.all([
                        collection.remove({ readerId, _id: { $nin: enlistmentIds }}),
                        collection.update({ readerId, _id: { $in: enlistmentIds }}, { $unset: { readerId: '' }})
                    ]);
                }

                return collection.remove({ readerId });
            })
            .then(() => {
                return matches;
            });
    }
};

export default enlistmentService;