export default function matchValidation() {

    return {
        validateActiveMatchDoesNotExist(match) {
            if (match) {
                throw 'You are already participating in a match!';
            }

            return match;
        }
    };
}