import { FilterAlt } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import HomeIcon from '@mui/icons-material/Home';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';

export const FieldToggleInternalScopeComponent = ({ input, p: polyglot }) => {
    const matches = useRouteMatch();

    const [values, setValues] = React.useState([]);

    React.useEffect(() => {
        if (!input) {
            return;
        }

        setValues((currentValues) => {
            if (currentValues.length > 0) {
                return currentValues;
            }

            if (matches.params.filter === 'dataset') {
                input.onChange(['home']);
                return ['home'];
            }

            if (matches.params.subresourceId) {
                input.onChange(['subRessource']);
                return ['subRessource'];
            }

            if (matches.params.filter === 'document') {
                input.onChange(['document']);
                return ['document'];
            }

            if (matches.params.filter === 'graphic') {
                input.onChange(['chart']);
                return ['chart'];
            }

            return [];
        });
    }, [input, matches]);

    useEffect(() => {
        Array.isArray(input.value) && setValues(input.value);
    }, [input.value]);

    const handleStateSelected = (_, newValues) => {
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
                    <FilterAlt />
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
