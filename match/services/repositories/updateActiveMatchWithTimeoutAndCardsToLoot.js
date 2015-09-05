import pdb from '../../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
    } = process.env;

export default function updateActiveMatchWithTimeoutAndCardsToLoot(match) {
    const { nextTurn } = match;

    return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'matches')
        .then(([db, col]) => {
            return col.update({ users: { $elemMatch: { id: nextTurn }}, active: true, nextTurn }, match);
        })
        .then(() => match);
}