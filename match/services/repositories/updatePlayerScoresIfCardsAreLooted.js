import pdb from '../../../util/pdb';

const {
    TECH_DOMAIN_MONGOLAB_URI
    } = process.env;

export default function updatePlayerScoresIfCardsAreLooted(match) {
    if (!match.cardsLooted || match.cardsLooted.length === 0) {
        return match;
    }

    const { users } = match;

    let playerOneId = users[0].id;
    let playerOneName = users[0].name;
    let playerOneAvatar = users[0].avatar;

    let playerTwoId = users[1].id;
    let playerTwoName = users[1].name;
    let playerTwoAvatar = users[1].avatar;

    let collection;

    return pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'playerDecks')
        .then(([db, col]) => {
            collection = col;
            return  collection.pfind({ userId: { $in: [ playerOneId, playerTwoId ] } }).toArray();
        })
        .then(docs => {
            const playerOneDeck = docs[0].userId === playerOneId ? docs[0] : docs[1];
            const playerTwoDeck = docs[0].userId === playerTwoId ? docs[0] : docs[1];

            let playerOneScore = playerOneDeck.deck.reduce(totalScoresForCards, 0);
            let playerTwoScore = playerTwoDeck.deck.reduce(totalScoresForCards, 0);

            pdb.connect(TECH_DOMAIN_MONGOLAB_URI, 'rankings')
                .then(([db, rankingsCollection]) => {
                    return Promise.all([
                        rankingsCollection.update(
                            { userId: playerOneId },
                            {
                                userId: playerOneId,
                                playerName: playerOneName,
                                score: playerOneScore,
                                avatar: playerOneAvatar
                            },
                            { upsert: true }),

                        rankingsCollection.update(
                            { userId: playerTwoId },
                            {
                                userId: playerTwoId,
                                playerName: playerTwoName,
                                score: playerTwoScore,
                                avatar: playerTwoAvatar
                            },
                            { upsert: true })
                    ]);
                });
        })
        .then(() => match);
}

function totalScoresForCards (previousCardScore, currentCard) {
    let attackValue = currentCard.attack;
    let defenseValue = currentCard.defense;

    return previousCardScore + (attackValue * defenseValue * (attackValue + defenseValue));
}