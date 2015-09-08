export default function playerPrimaryDeckValidation() {
    return {
        validatePlayerPrimaryDeckIsComplete(playerDeck) {
            const primaryDeckSize = playerDeck.primaryDeck ? playerDeck.primaryDeck.length : 0;
            if (primaryDeckSize !== 5) {
                throw `You do not have a complete primary deck. Missing ${5- primaryDeckSize} card(s)!`;
            }
        }
    };
}