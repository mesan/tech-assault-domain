import postBattleSimulatorController from './controllers/postBattleSimulatorController';

export default function battleSimulatorEndpoints(server) {

	server.route({
        method: 'POST',
        path: '/battle',
        handler: postBattleSimulatorController
    });
}