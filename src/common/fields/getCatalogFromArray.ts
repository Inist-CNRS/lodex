// @ts-expect-error TS(7006): Parameter 'array' implicitly has an 'any' type.
export default (array, key) => ({
    catalog: array.reduce(
        // @ts-expect-error TS(7006): Parameter 'acc' implicitly has an 'any' type.
        (acc, item) => ({
            ...acc,
            [item[key]]: item,
        }),
        {},
    ),

    // @ts-expect-error TS(2538): Type 'any' cannot be used as an index type.
    list: array.map(({ [key]: value }) => value),
});
