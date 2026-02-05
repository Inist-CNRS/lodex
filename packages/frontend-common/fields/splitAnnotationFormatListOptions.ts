// @ts-expect-error TS7006
export function splitAnnotationFormatListOptions(fieldValue) {
    const options =
        typeof fieldValue === 'string'
            ? fieldValue.split('\n')
            : (fieldValue ?? []);
    // @ts-expect-error TS7006
    return [...new Set(options.map((value) => value.trim()).filter(Boolean))];
}
