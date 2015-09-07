import enlistmentService from '../services/enlistmentService';

export default function deleteEnlistmentController(request, reply) {
    let userToken = request.params.userToken;

    enlistmentService.withdrawPlayer(userToken)
        .then(reply)
        .catch((err) => {
            console.error(err.stack);
            reply({ error: err }).code(400);
        });
}