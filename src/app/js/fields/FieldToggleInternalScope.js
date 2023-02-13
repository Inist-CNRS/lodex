import React, { useEffect } from 'react';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';
import PropTypes from 'prop-types';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import FilterAtIcon from './FilterAt';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';

export const FieldToggleInternalScopeComponent = ({ input, p: polyglot }) => {
    const [values, setValues] = React.useState([]);

    useEffect(() => {
        Array.isArray(input.value) && setValues(input.value);
    }, [input.value]);

    const handleStateSelected = (event, newValues) => {
        setValues(newValues);
        input.onChange(newValues);
    };

    return (
        <ToggleButtonGroup
            value={values}
            onChange={handleStateSelected}
            aria-label="text alignment"
            color="primary"
        >
            <ToggleButton value="home" aria-label="left aligned">
                <Tooltip title={polyglot.t('home_tooltip')}>
                    <HomeIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="document" aria-label="centered">
                <Tooltip title={polyglot.t('document_tooltip')}>
                    <ArticleIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="subRessource" aria-label="centered">
                <Tooltip title={polyglot.t('subRessource_tooltip')}>
                    <DocumentScannerIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="facet" aria-label="centered">
                <Tooltip title={polyglot.t('facet_tooltip')}>
                    <FilterAtIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="chart" aria-label="right aligned">
                <Tooltip title={polyglot.t('chart_tooltip')}>
                    <EqualizerIcon />
                </Tooltip>
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

FieldToggleInternalScopeComponent.propTypes = {
    input: PropTypes.object,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldToggleInternalScopeComponent);
