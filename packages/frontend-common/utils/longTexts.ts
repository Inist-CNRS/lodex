// @ts-expect-error TS7016
import cliTruncate from 'cli-truncate';
export const isLongText = (text = '', maxLength = 30) =>
    text && text.length > maxLength;

export const getShortText = (text = '', maxLength = 30) =>
    cliTruncate(String(text), maxLength);
