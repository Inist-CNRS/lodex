// @ts-expect-error TS7006
export function hasFieldMultipleValues(field) {
    return (
        field &&
        field.annotationFormat === 'list' &&
        field.annotationFormatListKind === 'multiple'
    );
}

// @ts-expect-error TS7006
export function getRedirectFieldHash(field) {
    return field?.name ? `#field-${field.name}` : '';
}
