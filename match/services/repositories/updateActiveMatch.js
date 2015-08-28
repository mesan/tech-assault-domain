import pdb from '../../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

export default function updateActiveMatch(match) {
    const { users, nextTurn } = match;

    // Find out user ID whose turn it originally was (nextTurn has been modified). Used in the update where condition.
    const userIds = users.map(user => user.id);
    const opponentIndex = userIds.indexOf(nextTurn);
    const userIndex = opponentIndex === 0 ? 1 : 0;
    const userId = userIds[userIndex];

    return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'matches')
        .then(([db, col]) => {
            return col.update({ users: { $elemMatch: { id: userId }}, active: true, nextTurn: userId }, match);
        })
        .then(() => match);
}