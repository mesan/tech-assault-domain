import {MongoClient} from 'mongodb';

export default {
    connect(connectionString, collectionName) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(connectionString, (err, db) => {
                if (err) {
                    return reject(err);
                }

                let collection = db.collection(collectionName);

                let pCollection = Object.create(collection);

                pCollection.pcount = pcount.bind(pCollection);
                pCollection.pfind = pfind.bind(pCollection);

                return resolve([db, pCollection]);
            });
        });
    }
};

function pfind() {
    let cursor = this.find.apply(this, arguments);

    let pCursor = Object.create(cursor);

    pCursor.toArray = () => {
        return new Promise((resolve, reject) => {
            cursor.toArray((err, docs) => {
                if (err) {
                    return reject(err);
                }

                return resolve(docs);
            });
        });
    };

    return pCursor;
}

function pcount() {
    return new Promise((resolve, reject) => {
        this.count((err, result) => {
            if (err) {
                return reject(err);
            }

            resolve(result);
        })
    });
}
