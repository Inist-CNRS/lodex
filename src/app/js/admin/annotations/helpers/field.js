export function hasFieldMultipleValues(field) {
    return (
        field &&
        field.annotationFormat === 'list' &&
        field.annotationFormatListKind === 'multiple'
    );
}
