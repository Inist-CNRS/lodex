export function splitAnnotationFormatListOptions(fieldValue) {
    const options =
        typeof fieldValue === 'string'
            ? fieldValue.split('\n')
            : fieldValue ?? [];
    return [...new Set(options.map((value) => value.trim()).filter(Boolean))];
}
