import matchService from '../services/matchService';

export default function postLootCardController(request, reply) {
    const { userId } = request.params;
    const loot = request.payload;

    matchService.performLoot(userId, loot)
        .then(reply)
        .catch(err => {
            console.error(err.stack);
            reply(err);
        });
}