import {getRandomNumbers} from '../../util/random';
import pdb from '../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
} = process.env;

let randomBaseCardService = {

    getRandomBaseCards(randomCount) {
        let col;

        return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'baseCards')
            .then(([db, collection]) => {
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
                let docs = docsList.map((docs) => {
                    return docs[0];
                });

                return docs;
            });
    }
};

export default randomBaseCardService;