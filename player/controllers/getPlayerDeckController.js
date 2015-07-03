import pdb from '../../util/pdb';

const { TECH_DOMAIN_MONGOLAB_URI } = process.env;

export default function getPlayerDeckController(request, reply) {

    let connection;

    pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
        .then(([db, collection, promise]) => {
            connection = db;
            return promise(collection.find({ userId: request.params.userId }).limit(1));
        })
        .then((decks) => {
            if (decks.length > 0) {
                reply(decks[0].deck);
            } else {
                reply(null);
            }

            connection.close();
        })
        .catch((err) => {
            console.log(err);
            reply(err);
        });
}