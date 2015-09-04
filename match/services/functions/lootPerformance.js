export default function lootPerformance(userId, loot) {

    const { cardId } = loot;

    return {
        setCardToLoot(match) {
            match.cardsLooted = [ cardId ];

            return match;
        },

        setMatchToInactive(match) {
            match.active = false;

            return match;
        }
    };
}