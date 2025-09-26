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

// @ts-expect-error TS2339
const Icon = React.forwardRef(function Icon({ scope, ...rest }, ref) {
    switch (scope) {
        case 'home':
            // @ts-expect-error TS2769
            return <HomeIcon {...rest} ref={ref} />;
        case 'document':
            // @ts-expect-error TS2769
            return <ArticleIcon {...rest} ref={ref} />;
        case 'subRessource':
            // @ts-expect-error TS2769
            return <DocumentScannerIcon {...rest} ref={ref} />;
        case 'facet':
            // @ts-expect-error TS2769
            return <FilterAlt {...rest} ref={ref} />;
        case 'chart':
            // @ts-expect-error TS2769
            return <EqualizerIcon {...rest} ref={ref} />;
        default:
            return null;
    }
});

// @ts-expect-error TS7031
function FieldInternalIcon({ scope, p: polyglot, ...rest }) {
    if (scope) {
        return (
            <Tooltip title={polyglot.t(`${scope}_tooltip`)}>
                {/*
                 // @ts-expect-error TS2322 */}
                <Icon scope={scope} {...rest} />
            </Tooltip>
        );
    }
    return null;
}
Icon.propTypes = {
    // @ts-expect-error TS2353
    scope: PropTypes.string.isRequired,
};

FieldInternalIcon.propTypes = {
    scope: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldInternalIcon);
