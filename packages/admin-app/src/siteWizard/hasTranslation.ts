declare const __FR__: Record<string, string> | undefined;
declare const __EN__: Record<string, string> | undefined;

export const hasTranslation = (key: string): boolean => {
    if (typeof __FR__ === 'undefined' || typeof __EN__ === 'undefined') {
        return false;
    }
    return !!__FR__?.[key] && !!__EN__?.[key];
};
