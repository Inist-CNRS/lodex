import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportHiddenResources } from '../api/hiddenResource';
import { translate } from '../../i18n/I18NContext';

// @ts-expect-error TS7031
const ExportButton = ({ p: polyglot }) => {
    const handleExport = async () => {
        const res = await exportHiddenResources();
        const file = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = file;
        link.download = 'hiddenResources.json';
        document.body.appendChild(link);
        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            }),
        );
        link.remove();
    };

    const buttonLabel = polyglot.t('export');
    return (
        <Button
            variant="text"
            onClick={handleExport}
            className="export"
            startIcon={<DownloadIcon />}
        >
            {buttonLabel}
        </Button>
    );
};

ExportButton.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(ExportButton);
