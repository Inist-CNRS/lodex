import Resumable from 'resumablejs';

export const loadFile = (url, file, token) =>
    new Promise((resolve, reject) => {
        const resumable = new Resumable({
            target: url,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        resumable.on('complete', resolve);
        resumable.on('error', (_, error) => reject(error));

        resumable.on('fileAdded', () => resumable.upload());
        resumable.addFile(file);
    });

export const loadDatasetFile = (file, token) => {
    const extension = file.name.split('.').pop();
    const url = `/api/upload/${extension}`;

    return loadFile(url, file, token);
};

export const loadModelFile = (file, token) =>
    loadFile('/api/field/import', file, token);
