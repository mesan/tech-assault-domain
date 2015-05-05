import {MongoClient} from 'mongodb';

export default function postRandomCardController(request, reply) {

    if (process.env.MONGOLAB_URI) {
        MongoClient.connect(process.env.MONGOLAB_URI, (err, db) => {
            console.log('Connected correctly to server!!!');
            db.close();
        });
    }
    
    return reply(JSON.parse(request.payload));
}