import pdb from '../../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
    } = process.env;

export default function updatePlayerDecks(match) {
    const { users, cardsLooted, winner, cards } = match;

    const winnerIndex = users.findIndex(user => user.id === winner);
    const loserIndex = winnerIndex === 0 ? 1 : 0;

    const cardsLootedObjects = cardsLooted.map(cardId => {
        const cardIndex = cards.findIndex(card => card.id === cardId);
        return cards[cardIndex];
    });

    const loser = users[loserIndex].id;

    let collection;

    return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
        .then(([db, col]) => {
            collection = col;
            return collection.pfind({ userId: { $in: [ winner, loser ] } }).toArray();
        })
        .then(docs => {
            const winnerPlayerDeck = docs[0].userId === winner ? docs[0] : docs[1];
            const loserPlayerDeck = docs[0].userId === loser ? docs[0]: docs[1];

            // Remove looted cards from loser's deck and primary deck.
            const newLoserPlayerDeck =
                loserPlayerDeck.deck.filter(card => cardsLooted.indexOf(card.id) === -1);
            const newLoserPlayerPrimaryDeck =
                loserPlayerDeck.primaryDeck.filter(cardId => cardsLooted.indexOf(cardId) === -1);

            // Add looted cards to winner's deck.
            const newWinnerPlayerDeck = winnerPlayerDeck.deck.concat(cardsLootedObjects);

            const newLoserDeckDoc = {
                deck: newLoserPlayerDeck,
                primaryDeck: newLoserPlayerPrimaryDeck
            };

            const newWinnerDeckDoc = {
                deck: newWinnerPlayerDeck
            };

            Promise.all([
                collection.update({ userId: loser }, { $set: newLoserDeckDoc }),
                collection.update({ userId: winner }, { $set: newWinnerDeckDoc })
            ]);
        })
        .then(() => match);
}