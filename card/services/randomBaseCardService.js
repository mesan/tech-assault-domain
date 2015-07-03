import {getRandomNumbers} from '../../util/random';
import pdb from '../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

export default {
    getRandomBaseCards(randomCount) {
        let skips = getRandomNumbers(0, 7, randomCount, false);

        return new Promise((resolve, reject) => {
            pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'baseCards')
                .then(([db, collection, promise]) => {
                    let promises = [];

                    skips.forEach((skip) => {
                        promises.push(promise(collection.find().limit(1).skip(skip)));
                    });

                    return Promise.all(promises);
                })
                .then((docsList) => {
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