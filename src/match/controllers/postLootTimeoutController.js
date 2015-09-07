import matchService from '../services/matchService';

export default function postLootTimeoutController(request, reply) {
    const { userId } = request.params;

    matchService.timeOutLooting(userId)
        .then(reply)
        .catch(err => {
            console.error(err.stack);
            reply({ error: err }).code(400);
        });
}