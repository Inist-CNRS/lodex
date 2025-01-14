import React, { useState } from 'react';
import { compose } from 'recompose';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';
import UploadIcon from '@mui/icons-material/Upload';
import { Button, CircularProgress, styled } from '@mui/material';
import { importHiddenResources } from '../api/hiddenResource';
import { toast } from '../../../../common/tools/toast';
import { useLocation, Redirect } from 'react-router-dom';

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

const ImportButton = ({ p: polyglot }) => {
    const buttonLabel = polyglot.t('import');
    const location = useLocation();
    const [uploading, setUploading] = useState(false);
    const [done, setDone] = useState(false);

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

ImportButton.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(ImportButton);
