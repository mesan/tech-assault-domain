import enlistmentService from '../services/enlistmentService';

export default function getMatchesController(request, reply) {
    enlistmentService.matchEnlistedPlayers()
        .then(reply)
        .catch((err) => {
            console.log(err.stack);
            reply(err);
        });
}