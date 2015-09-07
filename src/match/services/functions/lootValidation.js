export default function turnValidation(userId, loot) {

    const { cardId } = loot;

    return {
        validatePlayerIsWinner(match) {
            if (match.winner !== userId) {
                throw 'You are not the winner of this match!';
            }

            return match;
        },

        validateLootedCard(match) {
            const cardIsLootable = match.cardsToLoot && match.cardsToLoot.indexOf(cardId) !== -1;

            if (!cardIsLootable) {
                throw 'The card is not lootable!';
            }

            return match;
        }
    };
}