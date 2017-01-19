export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR';
export const UPLOAD_FILE_PENDING = 'UPLOAD_FILE_PENDING';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';

export const uploadFile = file => ({
    type: UPLOAD_FILE,
    payload: file,
});

export const uploadFilePending = () => ({
    type: UPLOAD_FILE_PENDING,
});

export const uploadFileSuccess = () => ({
    type: UPLOAD_FILE_SUCCESS,
});

export const uploadFileError = () => ({
    type: UPLOAD_FILE_ERROR,
});
