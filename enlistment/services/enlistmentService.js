import pdb from '../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

let enlistmentService = {

    enlistPlayer(userToken) {
        let connection;

        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'enlistments')
            .then(([db, collection]) => {
                connection = db;
                return collection.update({ userToken }, { userToken, enlisted: true }, { upsert: true });
            })
            .then((writeResult) => {
                connection.close();
                return writeResult;
            });
    },

    matchEnlistedPlayers() {

    }
};

export default enlistmentService;