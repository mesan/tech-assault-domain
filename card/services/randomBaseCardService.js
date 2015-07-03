import {getRandomNumbers} from '../../util/random';
import pdb from '../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

let randomBaseCardService = {

    getRandomBaseCards(randomCount) {
        let connection;

        let skips = getRandomNumbers(0, 7, randomCount, false);

        return new Promise((resolve, reject) => {
            pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'baseCards')
                .then(([db, collection, promise]) => {
                    connection = db;

                    let promises = [];

                    skips.forEach((skip) => {
                        promises.push(promise(collection.find({}, { _id: 0 }).limit(1).skip(skip)));
                    });

                    return Promise.all(promises);
                })
                .then((docsList) => {
                    connection.close();

                    let docs = docsList.map((docs) => {
                        return docs[0];
                    });

                    resolve(docs);
                })
                .catch((err) => {
                    throw err;
                });
        });
    }
};

export default randomBaseCardService;