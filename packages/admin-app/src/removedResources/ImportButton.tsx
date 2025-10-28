import { useState } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import { Button, CircularProgress, styled } from '@mui/material';
import { importHiddenResources } from '../api/hiddenResource';
import { toast } from '@lodex/common';
import { useLocation, Redirect } from 'react-router-dom';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ImportButton = () => {
    const { translate } = useTranslate();
    const buttonLabel = translate('import');
    const location = useLocation();
    const [uploading, setUploading] = useState(false);
    const [done, setDone] = useState(false);

    // @ts-expect-error TS7006
    const handleFileChange = async (event) => {
        setUploading(true);
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        const response = await importHiddenResources(formData);
        setUploading(false);
        if (response.error) {
            toast(translate('import_error'), {
                type: 'error',
            });
        } else {
            setDone(true);
            toast(translate('import_successful'), {
                type: 'success',
            });
        }
    };

    if (done) {
        return <Redirect to={location} />;
    }

    return (
        <Button
            component="label"
            variant="text"
            className="export"
            startIcon={
                uploading ? <CircularProgress size="1em" /> : <UploadIcon />
            }
            disabled={uploading}
        >
            {buttonLabel}
            <VisuallyHiddenInput
                onChange={handleFileChange}
                type="file"
                accept="application/json"
            />
        </Button>
    );
};

export default ImportButton;
