import { FilterAlt } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import HomeIcon from '@mui/icons-material/Home';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { translate } from '../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../propTypes';

// @ts-expect-error TS7031
export const FieldToggleInternalScopeComponent = ({ input, p: polyglot }) => {
    const matches = useRouteMatch();

    const [values, setValues] = React.useState(input?.value || []);

    React.useEffect(() => {
        if (
            !input ||
            input.value !== '' ||
            // @ts-expect-error TS2339
            matches.params.fieldName !== 'new'
        ) {
            return;
        }

        // @ts-expect-error TS7006
        setValues((currentValues) => {
            if (currentValues.length > 0) {
                return currentValues;
            }

            // @ts-expect-error TS2339
            if (matches.params.filter === 'dataset') {
                input.onChange(['home']);
                return ['home'];
            }

            // @ts-expect-error TS2339
            if (matches.params.subresourceId) {
                input.onChange(['subRessource']);
                return ['subRessource'];
            }

            // @ts-expect-error TS2339
            if (matches.params.filter === 'document') {
                input.onChange(['document']);
                return ['document'];
            }

            // @ts-expect-error TS2339
            if (matches.params.filter === 'graphic') {
                input.onChange(['chart']);
                return ['chart'];
            }

            return [];
        });
    }, [input, matches]);

    useEffect(() => {
        if (Array.isArray(input.value)) {
            setValues(input.value);
        }
    }, [input.value]);

    // @ts-expect-error TS7006
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
