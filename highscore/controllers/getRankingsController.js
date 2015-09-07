import {ObjectID} from 'mongodb';
import pdb from '../../util/pdb';

export default function getRankingsController(request, reply) {
    pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'rankings')        
        .then(([db, collection]) => {
            let numberOfRankings = parseInt(request.params.numberOfRankings);

            return collection.find({}, {_id : 0}).sort({score: -1}).limit(numberOfRankings).toArray();
        })
        .then((rankings) => {
            for (let index = 0; index < rankings.length; index++) {
                rankings[index].rank = index + 1;
            };

            reply(rankings);
        })
        .catch((err) => {
            console.log(err);
            reply(err);
        });  
}