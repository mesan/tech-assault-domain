export default function tap(func, returnValue, append = false) {
    return function () {
        func(...arguments);

        if (returnValue) {
            return append ? [arguments[0], returnValue] : returnValue;
        }

        return arguments[0];
    }
}