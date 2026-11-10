export const isHttpUrl = (url: string | null | undefined): boolean =>
    !!url && (url.startsWith('http://') || url.startsWith('https://'));
