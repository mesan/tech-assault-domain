import pdb from '../../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

export default function updateActiveMatchByWinner(match) {
    const { winner } = match;

    return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'matches')
        .then(([db, col]) => {
            return col.update({ users: { $elemMatch: { id: winner }}, active: true, winner }, match);
        })
        .then(() => match);
}