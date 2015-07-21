import enlistmentService from '../services/enlistmentService';

export default function postEnlistmentController(request, reply) {
    let userId = request.params.userId;

    enlistmentService.enlistPlayer(userId)
        .then(reply)
        .catch((err) => {
            console.log(err.stack);
            reply(err);
        });
}