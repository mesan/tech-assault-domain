import Card from '../domain/Card';
import {ObjectID} from 'mongodb';
import pdb from '../../util/pdb';

export default function getBaseCardController(request, reply) {
    pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'baseCards')
        .then(([db, collection]) => {
            return collection.pfind({ _id: ObjectID(request.params.baseCardId) }).toArray();
        })
        .then((baseCards) => {
            if (baseCards.length) {
                return reply(baseCards[0]);
            }

            reply();
        })
        .catch((err) => {
            console.log(err);
            reply(err);
        });
}