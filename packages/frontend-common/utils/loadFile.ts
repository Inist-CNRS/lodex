// @ts-expect-error TS2306
import Resumable from '@recuperateur/resumablejs';
import { DEFAULT_TENANT } from '@lodex/common';

// @ts-expect-error TS7006
export const loadFile = (url, file, token, customLoader = null) =>
    new Promise((resolve, reject) => {
        const options = {
            target: url,
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Lodex-Tenant':
                    sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT,
            },
            multipart: true,
        };

        if (customLoader) {
            // @ts-expect-error TS2339
            options.query = {
                customLoader,
            };
        }

        const resumable = new Resumable(options);

        // @ts-expect-error TS7006
        resumable.on('fileSuccess', (_, message) => {
            resolve(message);
        });
        // @ts-expect-error TS7006
        resumable.on('error', (_, error) => reject(error));

        resumable.on('fileAdded', () => {
            resumable.upload();
        });
        resumable.addFile(file);
    });

// @ts-expect-error TS7006
export const loadDatasetFile = (file, token, loaderName, customLoader) => {
    const extension = loaderName || file.name.split('.').pop();
    const url = `/api/upload/${extension}`;

    return loadFile(url, file, token, customLoader);
};

// @ts-expect-error TS7006
export const loadModelFile = (file, token) =>
    loadFile('/api/field/import', file, token);
