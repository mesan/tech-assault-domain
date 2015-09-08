import {MongoClient} from 'mongodb';

let connectionStrings = [];
let connections = [];

export default {
    connect(connectionString, collectionName) {
        return new Promise((resolve, reject) => {
            const connectionStringIndex = connectionStrings.indexOf(connectionString);

            if (connectionStringIndex !== -1) {
                return resolve(connections[connectionStringIndex]);
            }

            MongoClient.connect(connectionString, (err, connection) => {
                if (err) {
                    return reject(err);
                }

                connectionStrings.push(connectionString);
                connections.push(connection);
                resolve(connection);
            });
        })
        .then((connection) => {
            let collection = connection.collection(collectionName);

            let pCollection = Object.create(collection);

            pCollection.pcount = pcount.bind(pCollection);
            pCollection.pfind = pfind.bind(pCollection);
            pCollection.pfindOne = pfindOne.bind(pCollection);

            return [connection, pCollection];
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

    pCursor.pcount = pcount.bind(pCursor);

    return pCursor;
}


function pfindOne(query, options) {
    const args = [ query ];

    return new Promise((resolve, reject) => {
        args.push((err, doc) => {
            console.log(err, doc);
            if (err) {
                return reject(err);
            }

            resolve(doc);
        });

        this.findOne.apply(this, args);
    });
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
