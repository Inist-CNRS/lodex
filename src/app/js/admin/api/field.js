const { postDuplicateField, clearModelRequest } = require('../../user');
import { getUserLocalStorageInfo } from './tools';
import fetch from '../../lib/fetch';

const duplicateField = async ({ fieldId }) => {
    const { token } = getUserLocalStorageInfo();
    const request = postDuplicateField({ token }, { fieldId });
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

const clearModel = async () => {
    const { token } = getUserLocalStorageInfo();
    const request = clearModelRequest({ token });
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};

export default { duplicateField, clearModel };
