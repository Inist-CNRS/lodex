// @ts-expect-error TS6133
import React, { useState } from 'react';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import UploadIcon from '@mui/icons-material/Upload';
import { Button, CircularProgress, styled } from '@mui/material';
import { importHiddenResources } from '../api/hiddenResource';
import { toast } from '../../../../common/tools/toast';
import { useLocation, Redirect } from 'react-router-dom';
import { translate } from '../../i18n/I18NContext';

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

interface ImportButtonProps {
    p: unknown;
}

const ImportButton = ({
    p: polyglot
}: ImportButtonProps) => {
    const buttonLabel = polyglot.t('import');
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
            toast(polyglot.t('import_error'), {
                type: toast.TYPE.ERROR,
            });
        } else {
            setDone(true);
            toast(polyglot.t('import_successful'), {
                type: toast.TYPE.SUCCESS,
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

export default translate(ImportButton);
