export const loadFile = (url, file, token) =>
new Promise((resolve, reject) => {
    const oReq = new XMLHttpRequest();
    oReq.open('POST', url, true);
    oReq.withCredentials = true;
    oReq.setRequestHeader('Authorization', `Bearer ${token}`);
    oReq.onload = (event) => {
        if (event.currentTarget.status !== 200) {
            reject(new Error(event.currentTarget.responseText));
            return;
        }
        resolve();
    };
    oReq.onerror = reject;

    oReq.send(file);
});

export const loadDatasetFile = (file, token) => {
    const extension = file.name.split('.').pop();
    const url = `/api/upload/${extension}`;

    return loadFile(url, file, token);
};

export const loadModelFile = (file, token) =>
    loadFile('/api/field/import', file, token);

