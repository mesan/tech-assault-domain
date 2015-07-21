import enlistmentService from '../services/enlistmentService';

export default function postEnlistmentController(request, reply) {
    let userToken = request.params.userToken;

    enlistmentService.enlistPlayer(userToken)
        .then(reply)
        .catch((err) => {
            console.log(err.stack);
            reply(err);
        });
}