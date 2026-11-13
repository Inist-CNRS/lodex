import { Box, Typography } from '@mui/material';
import type { FileObject } from 'mui-file-dropzone';
import {
    getModelImportHelpKey,
    getModelTitleKey,
    type CatalogModel,
} from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import {
    DatasetSourceInput,
    type DatasetSourceTab,
} from '../upload/DatasetSourceInput';
import { hasTranslation } from './hasTranslation';
import { ModelLinks } from './ModelLinks';

// In French, "Modèle OpenAlex" reads "le modèle OpenAlex" inside a sentence.
// English titles start with the model's name ("OpenAlex model"): keep them.
export const getModelNameInSentence = (title: string, locale: 'fr' | 'en') =>
    locale === 'fr' ? title.slice(0, 1).toLowerCase() + title.slice(1) : title;

export const DataStepHeader = ({ model }: { model: CatalogModel }) => {
    const { translate, locale } = useTranslate();
    const importHelpKey = getModelImportHelpKey(model.id);
    return (
        <>
            <Typography color="text.secondary">
                {translate('site_wizard_data_subtitle', {
                    name: getModelNameInSentence(
                        translate(getModelTitleKey(model.id)),
                        locale,
                    ),
                })}
            </Typography>
            <ModelLinks model={model} />
            {hasTranslation(importHelpKey) && (
                <Typography sx={{ mt: 2 }}>
                    {translate(importHelpKey)}
                </Typography>
            )}
        </>
    );
};

type DataStepProps = {
    tab: DatasetSourceTab;
    onTabChange: (tab: DatasetSourceTab) => void;
    files: FileObject[];
    onFilesChange: (files: FileObject[]) => void;
    url: string;
    onUrlChange: (url: string) => void;
    text: string;
    onTextChange: (text: string) => void;
    tabs?: DatasetSourceTab[];
};

export const DataStep = (inputProps: DataStepProps) => (
    <Box>
        {/* The loader comes from the model: hide the "choose the loader" descriptions */}
        <DatasetSourceInput {...inputProps} hideDescriptions />
    </Box>
);
