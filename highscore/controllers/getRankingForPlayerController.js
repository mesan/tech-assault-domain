import {ObjectID} from 'mongodb';
import pdb from '../../util/pdb';

export default function getRankingsController(request, reply) {
    let userId = request.params.userId;

    pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'rankings')        
        .then(([db, collection]) => {
            var player = collection.findOne( { player : userId }, { _id: 0 });
            var rank = player.then((p) => {
                return collection.pfind({ score: { $gt: p.score } }).count();
            });

            return Promise.all([player, rank]);
        })
        .then(([player, rank] ) => {
            player.rank = rank + 1;
            reply(player);
        })
        .catch((err) => {
            console.log(err);
            reply(err);
        });
}







//            return Promise.resolve(
//                collection.findOne( { player : userId })
//            )
//            .then((player) => {
//                return collection.pfind({ score: { $gt: player.score } }).count();
//            })
//            .then((rank) => {
//                reply(rank + 1);
//            });
//        })