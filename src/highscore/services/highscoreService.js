import {ObjectID} from 'mongodb';
import pdb from '../../util/pdb';

export default {
    fetchRankingForPlayer(userId) {
        return pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'rankings')
            .then(([db, collection]) => {
                const player = collection
                    .pfindOne(
                    {userId: userId},
                    {_id: 0}); // excludes

                return Promise.all([ collection, player ]);
            })
            .then(([collection, player]) => {
                if (!player) {
                    player = { score: 0, rank: 0 };
                }

                const rank = collection
                    .pfind({ score: { $gt: player.score } })
                    .pcount();

                return Promise.all([player, rank]);
            })
            .then(([player, rank] ) => {
                player.rank = rank + 1;
                return player;
            });
    },

    fetchRankings(numberOfRankings) {
        return pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'rankings')
            .then(([db, collection]) => {
                return collection
                    .pfind({}, {_id : 0})
                    .sort({score: -1})
                    .limit(numberOfRankings)
                    .toArray();
            })
            .then((rankings) => {
                return rankings.map((rank) => {
                    rank.rank = rankings.indexOf(rank) + 1;
                    return rank;
                });
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    }
}