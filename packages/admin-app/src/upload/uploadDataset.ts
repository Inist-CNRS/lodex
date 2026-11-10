import fetch from '@lodex/frontend-common/fetch/fetch';
import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';
import {
    loadDatasetFile,
    type LoadFileOptions,
} from '@lodex/frontend-common/utils/loadFile';
import {
    getUploadTextRequest,
    getUploadUrlRequest,
} from '@lodex/frontend-common/user/reducer';

export type DatasetSource =
    | { type: 'file'; file: File }
    | { type: 'url'; url: string }
    | { type: 'text'; text: string };

/**
 * Resolves once the import job is queued (not when it is finished).
 * The options apply to a file, the only source long to upload.
 */
export const uploadDataset = async (
    source: DatasetSource,
    loaderName: string,
    fileOptions?: LoadFileOptions,
): Promise<void> => {
    const { token } = getUserSessionStorageInfo();

    if (source.type === 'file') {
        await loadDatasetFile(
            source.file,
            token,
            loaderName,
            null,
            fileOptions,
        );
        return;
    }

    const request =
        source.type === 'url'
            ? getUploadUrlRequest({ token }, { url: source.url, loaderName })
            : getUploadTextRequest(
                  { token },
                  { text: source.text, loaderName },
              );
    const { error } = await fetch(request);
    if (error) {
        throw error;
    }
};
