import pdb from '../../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

export default function findActiveMatch(userId) {
    return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'matches')
        .then(([db, col]) => {
            return col.pfind({ users: { $elemMatch: { id: userId }}, active: true }).toArray();
        })
        .then(docs => docs.length ? docs[0] : undefined);
}