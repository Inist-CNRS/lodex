import { Box, Typography } from '@mui/material';
import type { FileObject } from 'mui-file-dropzone';
import { getModelImportHelpKey, type CatalogModel } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import {
    DatasetSourceInput,
    type DatasetSourceTab,
} from '../upload/DatasetSourceInput';
import { hasTranslation } from './hasTranslation';
import { ModelLinks } from './ModelLinks';
import { ModelSubtitle } from './ModelSubtitle';

export const DataStepHeader = ({ model }: { model: CatalogModel }) => {
    const { translate } = useTranslate();
    const importHelpKey = getModelImportHelpKey(model.id);
    return (
        <>
            <ModelSubtitle
                model={model}
                translationKey="site_wizard_data_subtitle"
            />
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
