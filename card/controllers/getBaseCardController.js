import Card from '../domain/Card';
import {ObjectID} from 'mongodb';
import pdb from '../../util/pdb';

export default function getBaseCardController(request, reply) {
    pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'baseCards')
        .then(([db, collection, promise]) => {
            return promise(collection.find({ _id: ObjectID(request.params.baseCardId) }));
        })
        .then(([err, baseCards]) => {
            if (err) {
                return reply(err);
            }

            reply(baseCards);
        })
        .catch((err) => {
            console.log(err);
            reply(err);
        });
}