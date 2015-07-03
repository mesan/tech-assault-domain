import {getRandomNumbers} from '../../util/random';
import pdb from '../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

let randomBaseCardService = {

    getRandomBaseCards(randomCount) {
        let connection, col;

        return new Promise((resolve, reject) => {
            pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'baseCards')
                .then(([db, collection]) => {
                    connection = db;
                    col = collection;
                    return collection.pcount();
                })
                .then((count) => {
                    let skips = getRandomNumbers(0, count - 1, randomCount, false);

                    let promises = skips.map((skip) => {
                        return col.pfind({}, { _id: 0 }).limit(1).skip(skip).toArray();
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
                    console.log(err.stack);
                    reject(err);
                    throw err;
                });
        });
    }
};

export default randomBaseCardService;