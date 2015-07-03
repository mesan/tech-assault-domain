import Card from '../domain/Card';
import pdb from '../../util/pdb';
import {getRandomNumbers} from '../../util/random';

export default function getRandomBaseCardController(request, reply) {

    let randomCount = parseInt(request.params.randomCount, 10);

    let skips = getRandomNumbers(0, 7, randomCount, false);

    pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'baseCards')
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

            reply(docs);
        })
        .catch((err) => {
            console.log(err);
            reply(err);
        });
}