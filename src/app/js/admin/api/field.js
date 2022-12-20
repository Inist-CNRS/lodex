const { postDuplicateField } = require('../../user');
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

export default { duplicateField };
