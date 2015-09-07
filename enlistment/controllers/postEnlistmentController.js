import enlistmentService from '../services/enlistmentService';

export default function postEnlistmentController(request, reply) {
    const { userId, userToken } = request.params;

    enlistmentService.enlistPlayer(userId, userToken)
        .then(reply)
        .catch((err) => {
            console.error(err.stack);
            reply({ error: err }).code(400);
        });
}