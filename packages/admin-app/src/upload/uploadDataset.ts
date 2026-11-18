import fetch from '@lodex/frontend-common/fetch/fetch';
import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';
import {
    loadDatasetFile,
    type LoadFileOptions,
} from '@lodex/frontend-common/utils/loadFile';
import type { SiteDataAddChoice, SiteWizardChoice } from '@lodex/common';
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

// the same for a data add, read by the server on the last chunk
const getDataAddQuery = (
    dataAdd: SiteDataAddChoice,
): Record<string, string> => ({
    dataAdd: 'true',
    relaunch: String(dataAdd.relaunch),
    autoPublish: String(dataAdd.autoPublish),
});

export type DatasetSource =
    | { type: 'file'; file: File }
    | { type: 'url'; url: string }
    | { type: 'text'; text: string };

// both cannot be given: the wizard's choice wins on the server
export type DatasetChoiceOptions =
    | {
          // the wizard's choice: the server starts the site generation with
          // the data
          choice?: SiteWizardChoice;
          dataAdd?: never;
      }
    | {
          choice?: never;
          // a data add on the generated site: the server imports it, then
          // relaunches and publishes as asked
          dataAdd?: SiteDataAddChoice;
      };

export type UploadDatasetOptions = Pick<
    LoadFileOptions,
    'onProgress' | 'signal'
> &
    DatasetChoiceOptions;

/**
 * Resolves once the import job is queued (not when it is finished).
 * The progress and signal options apply to a file, the only source long to
 * upload.
 */
export const uploadDataset = async (
    source: DatasetSource,
    loaderName: string,
    {
        choice,
        dataAdd: requestedDataAdd,
        ...fileOptions
    }: UploadDatasetOptions = {},
): Promise<void> => {
    // the wizard's choice wins, as on the server
    const dataAdd = choice ? undefined : requestedDataAdd;
    const { token } = getUserSessionStorageInfo();

    if (source.type === 'file') {
        await loadDatasetFile(source.file, token, loaderName, null, {
            ...fileOptions,
            // read by the server on the last chunk
            ...(choice ? { query: getChoiceQuery(choice) } : {}),
            ...(dataAdd ? { query: getDataAddQuery(dataAdd) } : {}),
        });
        return;
    }

    const request =
        source.type === 'url'
            ? getUploadUrlRequest(
                  { token },
                  {
                      url: source.url,
                      loaderName,
                      siteGeneration: choice,
                      dataAdd,
                  },
              )
            : getUploadTextRequest(
                  { token },
                  {
                      text: source.text,
                      loaderName,
                      siteGeneration: choice,
                      dataAdd,
                  },
              );
    const { error } = await fetch(request);
    if (error) {
        throw error;
    }
};
