import React from 'react';
import { compose } from 'recompose';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';
import UploadIcon from '@mui/icons-material/Upload';
import { Button, styled } from '@mui/material';
import { importHiddenResources } from '../api/hiddenResource';

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
    const handleFileChange = async event => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        const res = await importHiddenResources(formData);
        console.log(res);
    };

    return (
        <>
            <Button
                component="label"
                variant="text"
                className="export"
                startIcon={<UploadIcon />}
            >
                {buttonLabel}
                <VisuallyHiddenInput
                    onChange={handleFileChange}
                    type="file"
                    accept="application/json"
                />
            </Button>
        </>
    );
};

ImportButton.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(ImportButton);
