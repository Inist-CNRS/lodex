import { alpha, Box, Typography } from '@mui/material';
import type { FileObject } from 'mui-file-dropzone';
import { getModelImportHelpKey, type CatalogModel } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import {
    DatasetSourceInput,
    type DatasetSourceTab,
} from '../upload/DatasetSourceInput';
import { hasTranslation } from './hasTranslation';
import { ModelLinks } from './ModelLinks';
import { StepTitle } from './StepTitle';

// the step title, the model links, then how to import the model's data,
// framed to stand apart from the input it explains
const DataStepIntro = ({ model }: { model: CatalogModel }) => {
    const { translate } = useTranslate();
    const importHelpKey = getModelImportHelpKey(model.id);
    return (
        <Box mb={1.5}>
            <StepTitle>{translate('site_wizard_data_title')}</StepTitle>
            <ModelLinks model={model} />
            {hasTranslation(importHelpKey) && (
                <Typography
                    fontSize={14}
                    sx={{
                        mt: 1.5,
                        px: 1.5,
                        py: 1.25,
                        whiteSpace: 'pre-line',
                        overflowWrap: 'anywhere',
                        borderLeft: 3,
                        borderColor: 'primary.main',
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.08),
                    }}
                >
                    {translate(importHelpKey)}
                </Typography>
            )}
        </Box>
    );
};

type DataStepProps = {
    model?: CatalogModel;
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

// The wizard has little height (13" screens): the input fills what the
// intro leaves, and the step scrolls only below its minimum height
export const DataStep = ({ model, ...inputProps }: DataStepProps) => (
    <Box display="flex" flexDirection="column" height="100%">
        {model && <DataStepIntro model={model} />}
        {/* The loader comes from the model: hide the "choose the loader" descriptions */}
        <DatasetSourceInput {...inputProps} hideDescriptions compact />
    </Box>
);
