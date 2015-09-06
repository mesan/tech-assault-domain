import pdb from '../../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
    } = process.env;

export default function updateActiveMatchByWinner(match) {
    const { users } = match;

    return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'matches')
        .then(([db, col]) => {
            return col.update({ users, active: true }, match);
        })
        .then(() => match);
}