// @ts-expect-error TS7006
export default (array) =>
    // @ts-expect-error TS7006
    array.sort((a, b) => {
        const typeA = typeof a.name;
        const typeB = typeof b.name;
        if (typeA === typeB) {
            return a.name < b.name ? -1 : 1;
        }
        if (typeA === 'number' && typeB === 'string') {
            return -1;
        }

        return 1;
    });
