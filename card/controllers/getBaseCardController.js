import Card from '../domain/Card';
import {MongoClient, ObjectID} from 'mongodb';

export default function getBaseCardController(request, reply) {
    if (process.env.MONGOLAB_URI) {
        MongoClient.connect(process.env.MONGOLAB_URI, (err, db) => {
            var collection = db.collection('baseCardCollection');
            collection.find({ _id: ObjectID(request.params.baseCardId) }).toArray((err, docs) => {
                reply(docs);
                db.close();
            });
        });
    }
}