import DOMPurify from 'dompurify';

export const sanitize = (dirty: unknown, defaultValue = ''): string => {
    if ([null, undefined, ''].includes(dirty?.toString())) {
        return defaultValue;
    }

    return DOMPurify.sanitize(dirty!.toString(), {
        ALLOWED_ATTR: [],
        ALLOWED_TAGS: [],
    });
};
