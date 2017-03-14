export const isLongText = (text = '') => text && text.length > 30;

export const getShortText = (text = '') => `${text.substr(0, 26)}...`;
