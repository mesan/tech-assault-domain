export default function battle(playerCard, opponentCard) {
	let attackValue = calculateAttributeValueForBattle(playerCard.attack);
	let defenseValue = calculateAttributeValueForBattle(opponentCard.defense);

	return {
		"attacker": playerCard,
		"defender": opponentCard,
		"attackValue": attackValue,
		"defenseValue": defenseValue,
		"winner": (attackValue > defenseValue) ? playerCard.owner : opponentCard.owner
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