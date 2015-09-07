import battleService from '../../match/services/battleService';

export default function postBattleSimulatorController(request, reply) {
	let playerCard = request.payload.playerCard;
	let board = request.payload.board;
	let cards = request.payload.cards;
	let index = request.payload.index;

	let events = battleService.performBattles(board, cards, playerCard, (typeof index === 'undefined') ? 1 : index);

	return reply(events);
}