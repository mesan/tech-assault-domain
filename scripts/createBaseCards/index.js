import pdb from '../../util/pdb';
import baseCardsData from './baseCardsData';

pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'baseCards')
    .then(([db, collection]) => {

        collection.remove();

        let bulk = collection.initializeUnorderedBulkOp();

        baseCardsData.forEach((baseCard) => {
            bulk.insert(baseCard);
        });

        bulk.execute();

        db.close();
    })
    .catch((err) => {
        console.log(err);
    });