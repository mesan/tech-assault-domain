export default {
    // Calculates the score of a single card
    scoreCard(card) {
        let attackValue = currentCard.attack;
        let defenseValue = currentCard.defense;

        return attackValue * defenseValue * (attackValue + defenseValue);
    },

    // Calculates the total score for a list of cards.
    totalScoreDeck(cards) {
        return cards.reduce(totalScoresForCards, 0);
    }
}

function totalScoresForCards (previousCardScore, currentCard) {
    let attackValue = currentCard.attack;
    let defenseValue = currentCard.defense;

    return previousCardScore + (attackValue * defenseValue * (attackValue + defenseValue));
}