import enlistmentService from '../services/enlistmentService';

export default function getMatchesController(request, reply) {
    enlistmentService.matchEnlistedPlayers()
        .then(reply)
        .catch((err) => {
            console.error(err.stack);
            reply({ error: err }).code(400);
        });
}