import fetch from '@lodex/frontend-common/fetch/fetch';
import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';
import {
    loadDatasetFile,
    type LoadFileOptions,
} from '@lodex/frontend-common/utils/loadFile';
import type { SiteWizardChoice } from '@lodex/common';
import {
    getUploadTextRequest,
    getUploadUrlRequest,
} from '@lodex/frontend-common/user/reducer';

// the multipart fields of the chunks, as texts: only the ones given
const getChoiceQuery = (choice: SiteWizardChoice): Record<string, string> =>
    Object.fromEntries(
        Object.entries(choice)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)]),
    );

export type DatasetSource =
    | { type: 'file'; file: File }
    | { type: 'url'; url: string }
    | { type: 'text'; text: string };

export type UploadDatasetOptions = Pick<
    LoadFileOptions,
    'onProgress' | 'signal'
> & {
    // the wizard's choice: the server starts the site generation with the data
    choice?: SiteWizardChoice;
};

/**
 * Resolves once the import job is queued (not when it is finished).
 * The progress and signal options apply to a file, the only source long to
 * upload.
 */
export const uploadDataset = async (
    source: DatasetSource,
    loaderName: string,
    { choice, ...fileOptions }: UploadDatasetOptions = {},
): Promise<void> => {
    const { token } = getUserSessionStorageInfo();

    if (source.type === 'file') {
        await loadDatasetFile(source.file, token, loaderName, null, {
            ...fileOptions,
            // read by the server on the last chunk
            ...(choice ? { query: getChoiceQuery(choice) } : {}),
        });
        return;
    }

    const request =
        source.type === 'url'
            ? getUploadUrlRequest(
                  { token },
                  { url: source.url, loaderName, siteGeneration: choice },
              )
            : getUploadTextRequest(
                  { token },
                  { text: source.text, loaderName, siteGeneration: choice },
              );
    const { error } = await fetch(request);
    if (error) {
        throw error;
    }
};
