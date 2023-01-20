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
    // ['fromSubressource', 'fromSubressource'],
]);

export const GET_SOURCE_VALUE_FROM_TRANSFORMERS = transformers => {
    if (!transformers) {
        return { source: null, value: null };
    }

    const isSubressourceFromColumn = transformers
        .map(t => t.operation)
        .join('|')
        .includes('COLUMN|PARSE|GET');

    if (isSubressourceFromColumn) {
        return {
            source: 'fromColumnsForSubRessource',
            value: transformers[2]?.args && [transformers[2].args[0]?.value],
        };
    }

    const operations = {
        VALUE: {
            source: 'arbitrary',
            value: transformers[0]?.args && transformers[0].args[0]?.value,
        },
        COLUMN: {
            source: 'fromColumns',
            value: transformers[0]?.args && [transformers[0].args[0]?.value],
        },
        CONCAT: {
            source: 'fromColumns',
            value:
                transformers[0]?.args &&
                transformers[0]?.args.map(({ value }) => value || ''),
        },
    };

    const { operation } = transformers[0];

    return operation in operations
        ? operations[operation]
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
    currentSource,
    currentValue,
    updateTransformers,
    p: polyglot,
    subresourceUri,
}) => {
    const [source, setSource] = React.useState(currentSource);
    React.useEffect(() => {
        setSource(currentSource);
    }, [currentSource]);

    const handleChange = (event, newSource) => {
        if (!newSource) {
            return;
        }

        const transformersFromStatus = TRANSFORMERS_FORM_STATUS.get(newSource);
        updateTransformers(transformersFromStatus);
        setSource(newSource);
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
                <ToggleButton value="fromSubressource">
                    <FromSubRessourceIcon style={{ fontSize: 50 }} />
                    <Typography variant="caption">
                        {polyglot.t('from_subressource')}
                    </Typography>
                </ToggleButton>
            </ToggleButtonGroup>

            {source === 'arbitrary' && (
                <SourceValueArbitrary
                    updateTransformers={updateTransformers}
                    value={currentValue}
                />
            )}

            {source === 'fromColumns' && (
                <SourceValueFromColumns
                    updateTransformers={updateTransformers}
                    value={currentValue}
                />
            )}

            {source === 'fromColumnsForSubRessource' && (
                <SourceValueFromColumnsForSubRessource
                    updateTransformers={updateTransformers}
                    value={currentValue}
                    subresourceUri={subresourceUri}
                />
            )}
        </Box>
    );
};

SourceValueToggle.propTypes = {
    currentSource: PropTypes.string,
    currentValue: PropTypes.string,
    updateTransformers: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    subresourceUri: PropTypes.string,
};

const mapStateToProps = state => {
    const currentTransformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    const {
        source: currentSource,
        value: currentValue,
    } = GET_SOURCE_VALUE_FROM_TRANSFORMERS(currentTransformers);

    return { currentSource, currentValue };
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
