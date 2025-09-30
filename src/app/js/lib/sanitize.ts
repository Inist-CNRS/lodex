import DOMPurify from 'dompurify';

export const sanitize = (
    dirty: string | null | undefined,
    defaultValue = '',
): string => {
    if ([null, undefined, ''].includes(dirty)) {
        return defaultValue;
    }
    return DOMPurify.sanitize(dirty as string).replace(/<[^>]*>/g, '');
};
