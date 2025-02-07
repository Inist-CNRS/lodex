import { FilterAlt } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import HomeIcon from '@mui/icons-material/Home';
import { Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { translate } from '../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../propTypes';

const Icon = React.forwardRef(function Icon({ scope, ...rest }, ref) {
    switch (scope) {
        case 'home':
            return <HomeIcon {...rest} ref={ref} />;
        case 'document':
            return <ArticleIcon {...rest} ref={ref} />;
        case 'subRessource':
            return <DocumentScannerIcon {...rest} ref={ref} />;
        case 'facet':
            return <FilterAlt {...rest} ref={ref} />;
        case 'chart':
            return <EqualizerIcon {...rest} ref={ref} />;
        default:
            return null;
    }
});

function FieldInternalIcon({ scope, p: polyglot, ...rest }) {
    if (scope) {
        return (
            <Tooltip title={polyglot.t(`${scope}_tooltip`)}>
                <Icon scope={scope} {...rest} />
            </Tooltip>
        );
    }
    return null;
}
Icon.propTypes = {
    scope: PropTypes.string.isRequired,
};

FieldInternalIcon.propTypes = {
    scope: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldInternalIcon);
