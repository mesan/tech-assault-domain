export default function battle(playerCard, opponentCard) {
	let attackValue = calculateAttributeValueForBattle(playerCard.attack);
	let defenceValue = calculateAttributeValueForBattle(opponentCard.defence);

	return {
		"attacker": playerCard,
		"defender": opponentCard,
		"attackValue": attackValue,
		"defenceValue": defenceValue,
		"winner": (attackValue > defenceValue) ? 'PLAYER' : 'OPPONENT'
	};
};

function calculateAttributeValueForBattle(cardAttributeValue) {
	let attributeRange = findIntervalRangeFromValue(cardAttributeValue);

	let attributeValue = randomValueFromIntervall(
		attributeRange.min, 
		attributeRange.max);

	let penaltyValue = randomValueFromIntervall(0, attributeValue);

	return attributeValue - penaltyValue;
};

function findIntervalRangeFromValue(value) {
	return {
		min: value * 10,
		max: (value * 10) + 9
	}
};

function randomValueFromIntervall(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};