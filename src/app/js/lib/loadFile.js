import Resumable from '../../../common/tools/resumable';
import { DEFAULT_TENANT } from '../../../common/tools/tenantTools';

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
            options.query = {
                customLoader,
            };
        }

        const resumable = new Resumable(options);

        resumable.on('fileSuccess', (_, message) => {
            resolve(message);
        });
        resumable.on('error', (_, error) => reject(error));

        resumable.on('fileAdded', () => {
            resumable.upload();
        });
        resumable.addFile(file);
    });

export const loadDatasetFile = (file, token, loaderName, customLoader) => {
    const extension = loaderName || file.name.split('.').pop();
    const url = `/api/upload/${extension}`;

    return loadFile(url, file, token, customLoader);
};

export const loadModelFile = (file, token) =>
    loadFile('/api/field/import', file, token);
