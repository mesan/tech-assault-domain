import {MongoClient} from 'mongodb';

export default {
    connect(connectionString, collectionName) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(connectionString, (err, db) => {
                if (err) {
                    throw err;
                    return reject(err);
                }

                let collection = db.collection(collectionName);

                return resolve([db, collection, promise]);
            });
        });
    }
};

function promise(cursor) {
    return new Promise((resolve, reject) => {
        cursor.toArray((err, docs) => {
            if (err) {
                throw err;
                return reject(err);
            }

            return resolve(docs);
        });
    });
}
