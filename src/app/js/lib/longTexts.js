export const isLongText = (text = '') => text && text.length > 50;

export const getShortText = (text = '') => `${text.substr(0, 47)}...`;
