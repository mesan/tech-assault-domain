export default function matchValidation() {

    return {
        validateMatchIsFinished(match) {
            if (!match.finished) {
                throw 'Match is not finished!';
            }

            return match;
        },

        validateActiveMatchExists(match) {
            if (!match) {
                throw 'No active match found!';
            }

            return match;
        }
    };
}