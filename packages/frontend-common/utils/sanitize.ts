import DOMPurify from 'dompurify';

if (typeof window === 'object') {
    // currently dompurify don't support NodeJS as a runtime
    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
        // set all elements owning target to target=_blank
        if ('target' in node) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener');
        }
    });
}

export const sanitize = (dirty: unknown, defaultValue = ''): string => {
    if ([null, undefined, ''].includes(dirty?.toString())) {
        return defaultValue;
    }

    return DOMPurify.sanitize(dirty!.toString(), {
        ALLOWED_ATTR: ['target'],
        ALLOWED_TAGS: [],
    });
};
