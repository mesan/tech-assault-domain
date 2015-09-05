import pdb from '../../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
    } = process.env;

export default function insertEnlistments(user) {
    const { userId, userToken } = user;

    return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'enlistments')
        .then(([db, collection]) => {
            return collection.update({ userToken }, { userToken }, { upsert: true });
        });
}