import battleService from '../../match/services/battleService';

export default function postBattleSimulatorController(request, reply) {
	let playerCard = request.payload.playerCard;
	let board = request.payload.board;
	let cards = request.payload.cards;

	let events = battleService.performBattles(board, cards, playerCard, 1);

	return reply(events);
}