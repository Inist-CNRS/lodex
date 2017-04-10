export const isLongText = (text = '', maxLength = 30) => text && text.length > maxLength;

export const getShortText = (text = '', maxLength = 30) => `${text.substr(0, maxLength - 4)}...`;
