export default function matchValidation() {

    return {
        validateMatchIsFinished(match) {
            if (!match.finished) {
                throw 'Match is not finished!';
            }

            return match;
        },

        validateMatchIsNotFinished(match) {
            if (match.finished) {
                throw 'Match is finished!';
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