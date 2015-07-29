import {ObjectID} from 'mongodb';
import pdb from '../../util/pdb';

// TODO: Remove ranking and move player score to player object
export default function getRankingsController(request, reply) {
    pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'rankings')        
        .then(([db, collection]) => {
            let numberOfRankings = parseInt(request.params.numberOfRankings);

            reply(collection.find().sort({score: -1}).limit(numberOfRankings).toArray());
        })
        .catch((err) => {
            console.log(err);
            reply(err);
        });  
}