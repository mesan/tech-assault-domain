export default function turnValidation(userId, turn) {

    const { cardId, cardPosition } = turn;

    return {
        validateActiveMatchExists(match) {
            if (!match) {
                throw 'No active match found!';
            }

            return match;
        },

        validatePlayerTurn(match) {
            // Is it this player's turn?
            if (match.nextTurn !== userId) {
                throw 'Not your turn!';
            }

            return match;
        },

        validateCard(match) {
            const { users, primaryDecks } = match;

            // Is it a valid card?
            const userIndex = users.map(user => user.id).indexOf(userId);
            const primaryDeck = primaryDecks[userIndex];

            const cardIdIndex = primaryDeck.map(card => card.id).indexOf(cardId);

            const invalidCardId = cardIdIndex === -1;

            if (invalidCardId) {
                throw `Invalid card ID! (${cardId})`;
            }

            return match;
        },

        validatePosition(match) {
            const { board } = match;

            // Is it a valid position on the board?
            const invalidPosition = board[cardPosition] !== 0;

            if (invalidPosition) {
                throw `Invalid placement of card! (${cardPosition})`;
            }

            return match;
        }
    };
}