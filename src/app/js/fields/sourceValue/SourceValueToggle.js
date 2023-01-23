import * as React from 'react';
import ArbitraryIcon from '@mui/icons-material/FormatQuote';
import colorsTheme from '../../../custom/colorsTheme';
import compose from 'recompose/compose';
import FromColumnsIcon from '@mui/icons-material/ViewColumn';
import FromSubRessourceIcon from '@mui/icons-material/DocumentScanner';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import SourceValueArbitrary from './SourceValueArbitrary';
import SourceValueFromColumns from './SourceValueFromColumns';
import SourceValueFromColumnsForSubRessource from './SourceValueFromColumnsForSubRessource';

import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { FIELD_FORM_NAME } from '..';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { Typography } from '@material-ui/core';
import { styled } from '@mui/material/styles';

import {
    Box,
    ToggleButtonGroup,
    ToggleButton as MuiToggleButton,
} from '@mui/material';

const TRANSFORMERS_FORM_STATUS = new Map([
    [
        'arbitrary',
        [
            {
                operation: 'VALUE',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                    },
                ],
            },
        ],
    ],
    [
        'fromColumns',
        [
            {
                operation: 'COLUMN',
                args: [
                    {
                        name: 'column',
                        type: 'column',
                    },
                ],
            },
        ],
    ],
    [
        'fromColumnsForSubRessource',
        [
            {
                operation: 'COLUMN',
                args: [
                    {
                        name: 'column',
                        type: 'column',
                    },
                ],
            },
            {
                operation: 'PARSE',
            },
            {
                operation: 'GET',
                args: [
                    {
                        name: 'path',
                        type: 'string',
                    },
                ],
            },
        ],
    ],
    // ['fromSubressource', 'fromSubressource'],
]);

export const GET_SOURCE_VALUE_FROM_TRANSFORMERS = transformers => {
    if (!transformers || !transformers[0]?.operation) {
        return { source: null, value: null };
    }

    const transformersOperations = transformers.map(t => t.operation).join('|');

    if (
        transformersOperations ===
        'COLUMN|PARSE|GET|STRING|REPLACE_REGEX|MD5|REPLACE_REGEX'
    ) {
        return {
            source: 'fromSubressource',
            value: null,
        };
    }

    if (
        transformersOperations ===
        'COLUMN|PARSE|GET|STRING|REPLACE_REGEX|REPLACE_REGEX|TRIM'
    ) {
        return {
            source: 'fromSubressource',
            value: transformers[2]?.args && [transformers[2].args[0]?.value],
        };
    }

    const isSubressourceFromColumn = transformersOperations.includes(
        'COLUMN|PARSE|GET',
    );

    if (isSubressourceFromColumn) {
        return {
            source: 'fromColumnsForSubRessource',
            value: transformers[2]?.args && [transformers[2].args[0]?.value],
        };
    }

    const sourceValues = {
        VALUE: {
            source: 'arbitrary',
            value: transformers[0]?.args && transformers[0].args[0]?.value,
        },
        COLUMN: {
            source: 'fromColumns',
            // if value undefined, it will be set to empty array
            value:
                transformers[0]?.args && transformers[0].args[0]?.value
                    ? [transformers[0].args[0]?.value]
                    : [],
        },
        CONCAT: {
            source: 'fromColumns',
            value:
                transformers[0]?.args &&
                transformers[0]?.args.map(({ value }) => value || ''),
        },
    };

    const { operation } = transformers[0];

    return operation in sourceValues
        ? sourceValues[operation]
        : { source: null, value: null };
};

const ToggleButton = styled(MuiToggleButton)(() => ({
    ...{
        display: 'flex',
        flexDirection: 'column',
        width: '145px',
        justifyContent: 'flex-start',
        gap: '5px',
        '&.Mui-selected, &.Mui-selected:hover': {
            color: 'white',
            backgroundColor: colorsTheme.green.secondary,
        },
    },
}));

export const SourceValueToggle = ({
    currentTransformers,
    updateTransformers,
    p: polyglot,
    subresourceUri,
}) => {
    const [source, setSource] = React.useState(null);
    const [value, SetValue] = React.useState(null);
    React.useEffect(() => {
        const {
            source: currentSource,
            value: currentValue,
        } = GET_SOURCE_VALUE_FROM_TRANSFORMERS(currentTransformers);
        setSource(currentSource);
        SetValue(currentValue);
    }, [currentTransformers]);

    const handleChange = (event, newSource) => {
        if (!newSource) {
            return;
        }
        const transformersFromStatus = TRANSFORMERS_FORM_STATUS.get(newSource);
        updateTransformers(transformersFromStatus);
    };

    return (
        <Box mt={20}>
            <Typography variant="subtitle1">
                {polyglot.t('source_value')}
            </Typography>
            <ToggleButtonGroup
                value={source}
                exclusive
                onChange={handleChange}
                aria-label="Choix de la valeur"
            >
                <ToggleButton value="arbitrary">
                    <ArbitraryIcon style={{ fontSize: 50 }} />
                    <Typography variant="caption">
                        {polyglot.t('arbitrary_value')}
                    </Typography>
                </ToggleButton>
                <ToggleButton
                    value={
                        subresourceUri
                            ? 'fromColumnsForSubRessource'
                            : 'fromColumns'
                    }
                >
                    <FromColumnsIcon style={{ fontSize: 50 }} />
                    <Typography variant="caption">
                        {polyglot.t('from_columns')}
                    </Typography>
                </ToggleButton>
                {!subresourceUri && (
                    <ToggleButton value="fromSubressource">
                        <FromSubRessourceIcon style={{ fontSize: 50 }} />
                        <Typography variant="caption">
                            {polyglot.t('from_subressource')}
                        </Typography>
                    </ToggleButton>
                )}
            </ToggleButtonGroup>

            {source === 'arbitrary' && (
                <SourceValueArbitrary
                    updateTransformers={updateTransformers}
                    value={value}
                />
            )}

            {source === 'fromColumns' && (
                <SourceValueFromColumns
                    updateTransformers={updateTransformers}
                    value={value}
                />
            )}

            {source === 'fromColumnsForSubRessource' && (
                <SourceValueFromColumnsForSubRessource
                    updateTransformers={updateTransformers}
                    value={value}
                    subresourceUri={subresourceUri}
                />
            )}
        </Box>
    );
};

SourceValueToggle.propTypes = {
    currentTransformers: PropTypes.arrayOf(PropTypes.object),
    updateTransformers: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    subresourceUri: PropTypes.string,
};

const mapStateToProps = state => {
    const currentTransformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    return { currentTransformers };
};

const mapDispatchToProps = dispatch => ({
    updateTransformers: valueTransformers => {
        return dispatch(
            change(FIELD_FORM_NAME, 'transformers', valueTransformers),
        );
    },
});

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(SourceValueToggle);
