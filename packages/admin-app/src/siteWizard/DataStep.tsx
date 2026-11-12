import { Box } from '@mui/material';
import type { FileObject } from 'mui-file-dropzone';
import { type CatalogModel } from '@lodex/common';
import {
    DatasetSourceInput,
    type DatasetSourceTab,
} from '../upload/DatasetSourceInput';
import { ModelLinks } from './ModelLinks';
import { ModelSubtitle } from './ModelSubtitle';

export const DataStepHeader = ({ model }: { model: CatalogModel }) => (
    <>
        <ModelSubtitle
            model={model}
            translationKey="site_wizard_data_subtitle"
        />
        <ModelLinks model={model} />
    </>
);

type DataStepProps = {
    tab: DatasetSourceTab;
    onTabChange: (tab: DatasetSourceTab) => void;
    files: FileObject[];
    onFilesChange: (files: FileObject[]) => void;
    url: string;
    onUrlChange: (url: string) => void;
    text: string;
    onTextChange: (text: string) => void;
};

export const DataStep = (inputProps: DataStepProps) => (
    <Box>
        {/* The loader comes from the model: hide the "choose the loader" descriptions */}
        <DatasetSourceInput {...inputProps} hideDescriptions />
    </Box>
);
