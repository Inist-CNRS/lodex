import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { Tooltip } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';

function Icon({ scope, ...rest }) {
    switch (scope) {
        case 'home':
            return <HomeIcon {...rest} />;
        case 'document':
            return <ArticleIcon {...rest} />;
        case 'subRessource':
            return <DocumentScannerIcon {...rest} />;
        case 'facet':
            return <FilterAlt {...rest} />;
        case 'chart':
            return <EqualizerIcon {...rest} />;
        default:
            return null;
    }
}
function FieldInternalIcon({ scope, p: polyglot, ...rest }) {
    if (scope) {
        return (
            <Tooltip title={polyglot.t(`${scope}_tooltip`)}>
                <Icon scope={scope} {...rest} />
            </Tooltip>
        );
    }
}
Icon.propTypes = {
    scope: PropTypes.string.isRequired,
    props: polyglotPropTypes.isRequired,
};
FieldInternalIcon.propTypes = {
    scope: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldInternalIcon);
