import DOMPurify from 'dompurify';

if (typeof window === 'object') {
    DOMPurify.removeHooks('afterSanitizeAttributes');
    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
        if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
            node.setAttribute('rel', 'noopener');
        }
    });
}

export const sanitize = (dirty: unknown, defaultValue = ''): string => {
    if (dirty == null || dirty === '') {
        return defaultValue;
    }

    return DOMPurify.sanitize(dirty!.toString(), {
        ADD_ATTR: ['target'],
    });
};
