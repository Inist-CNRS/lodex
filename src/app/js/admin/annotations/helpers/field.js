export function hasFieldMultipleValues(field) {
    return (
        field &&
        field.annotationFormat === 'list' &&
        field.annotationFormatListKind === 'multiple'
    );
}

export function getRedirectFieldHash(field) {
    return field?.name ? `#field-${field.name}` : '';
}
