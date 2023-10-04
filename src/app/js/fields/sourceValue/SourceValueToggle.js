import * as React from 'react';
import ArbitraryIcon from '@mui/icons-material/FormatQuote';
import compose from 'recompose/compose';
import FromColumnsIcon from '@mui/icons-material/ViewColumn';
import FromSubRessourceIcon from '@mui/icons-material/DocumentScanner';
import ProcessingIcon from '@mui/icons-material/Settings';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import SourceValueArbitrary from './SourceValueArbitrary';
import SourceValueExternal from './SourceValueExternal';
import SourceValueFromColumns from './SourceValueFromColumns';
import SourceValueFromColumnsForSubResource from './SourceValueFromColumnsForSubResource';

import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { FIELD_FORM_NAME } from '..';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { styled } from '@mui/material/styles';

import {
    Box,
    ToggleButtonGroup,
    ToggleButton as MuiToggleButton,
    Typography,
} from '@mui/material';
import SourceValueFromSubResource from './SourceValueFromSubResource';
import customTheme from '../../../custom/customTheme';

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
        'external',
        [
            {
                operation: 'WEBSERVICE',
                args: [
                    {
                        name: 'webservice',
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
]);

export const GET_SOURCE_VALUE_FROM_TRANSFORMERS = (
    transformers,
    isSubresourceField = false,
) => {
    if (!transformers || !transformers[0]?.operation) {
        return { source: null, value: null };
    }

    const transformersOperations = transformers.map(t => t.operation).join('|');

    if (
        transformersOperations ===
        'COLUMN|PARSE|GET|STRING|REPLACE_REGEX|MD5|REPLACE_REGEX'
    ) {
        return {
            source: 'fromSubresource',
            value: null,
        };
    }

    if (
        transformersOperations.startsWith(
            'COLUMN|PARSE|GET|STRING|REPLACE_REGEX|REPLACE_REGEX|TRIM',
        )
    ) {
        return {
            source: 'fromSubresource',
            value: transformers[2]?.args && transformers[2].args[0]?.value,
        };
    }

    const isFromColumnsForSubRessource =
        transformersOperations.startsWith('COLUMN|PARSE|GET') &&
        isSubresourceField;

    if (isFromColumnsForSubRessource) {
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
        WEBSERVICE: {
            source: 'external',
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
            backgroundColor: customTheme.palette.primary.secondary,
        },
        '&.Mui-disabled': {
            backgroundColor: customTheme.palette.neutralDark.veryLight,
        },
    },
}));

export const SourceValueToggle = ({
    arbitraryMode,
    currentTransformers,
    updateTransformers,
    p: polyglot,
    selectedSubresourceUri,
    subresources,
}) => {
    const [source, setSource] = React.useState(null);
    const [value, setValue] = React.useState(null);
    React.useEffect(() => {
        const {
            source: currentSource,
            value: currentValue,
        } = GET_SOURCE_VALUE_FROM_TRANSFORMERS(
            currentTransformers,
            selectedSubresourceUri && true,
        );
        setSource(currentSource);
        setValue(currentValue);
    }, [currentTransformers]);

    const updateDefaultValueTransformers = (
        currentSource,
        currentTransformers,
        newTransformers,
    ) => {
        let defaultTransformersLength = 0;
        if (
            currentSource === 'arbitrary' ||
            currentSource === 'external' ||
            currentSource === 'fromColumns'
        ) {
            defaultTransformersLength = 1;
        }
        if (currentSource === 'fromColumnsForSubRessource') {
            defaultTransformersLength = 3;
        }
        if (currentSource === 'fromSubresource') {
            defaultTransformersLength = 7;
        }
        const nonDefaultTransformers = currentTransformers.slice(
            defaultTransformersLength,
        );
        updateTransformers([...newTransformers, ...nonDefaultTransformers]);
    };

    const handleChange = (event, newSource) => {
        if (!newSource) {
            return;
        }

        if (newSource === 'fromSubresource') {
            const transformers = subresources
                ? [
                      {
                          operation: 'COLUMN',
                          args: [
                              {
                                  name: 'column',
                                  type: 'column',
                                  value: subresources[0].path,
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
                                  value: subresources[0].identifier,
                              },
                          ],
                      },
                      { operation: 'STRING' },
                      {
                          operation: 'REPLACE_REGEX',
                          args: [
                              {
                                  name: 'searchValue',
                                  type: 'string',
                                  value: '^(.*)$',
                              },
                              {
                                  name: 'replaceValue',
                                  type: 'string',
                                  value: `${subresources[0]._id}/$1`,
                              },
                          ],
                      },
                      { operation: 'MD5', args: [] },
                      {
                          operation: 'REPLACE_REGEX',
                          args: [
                              {
                                  name: 'searchValue',
                                  type: 'string',
                                  value: '^(.*)$',
                              },
                              {
                                  name: 'replaceValue',
                                  type: 'string',
                                  value: `uid:/$1`,
                              },
                          ],
                      },
                  ]
                : [];

            // if the new source is fromSubresource, we can not keep other transformers
            // because we can not add other transformers to a field from a subresource without a specified column
            updateTransformers(transformers);
            return;
        }

        const transformersFromStatus = TRANSFORMERS_FORM_STATUS.get(newSource);
        updateDefaultValueTransformers(
            source,
            currentTransformers,
            transformersFromStatus,
        );
    };

    return (
        <Box pt={5}>
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
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

                <ToggleButton value="external">
                    <ProcessingIcon style={{ fontSize: 50 }} />
                    <Typography variant="caption">
                        {polyglot.t('external_processing')}
                    </Typography>
                </ToggleButton>

                <ToggleButton
                    disabled={arbitraryMode}
                    value={
                        selectedSubresourceUri
                            ? 'fromColumnsForSubRessource'
                            : 'fromColumns'
                    }
                >
                    <FromColumnsIcon style={{ fontSize: 50 }} />
                    <Typography variant="caption">
                        {polyglot.t('from_columns')}
                    </Typography>
                </ToggleButton>
                {!selectedSubresourceUri && (
                    <ToggleButton
                        value="fromSubresource"
                        disabled={!subresources.length > 0 || arbitraryMode}
                    >
                        <FromSubRessourceIcon style={{ fontSize: 50 }} />
                        <Typography variant="caption">
                            {polyglot.t('from_subresource')}
                        </Typography>
                    </ToggleButton>
                )}
            </ToggleButtonGroup>

            {source === 'arbitrary' && (
                <SourceValueArbitrary
                    updateDefaultValueTransformers={newTransformers =>
                        updateDefaultValueTransformers(
                            source,
                            currentTransformers,
                            newTransformers,
                        )
                    }
                    value={value}
                />
            )}

            {source === 'external' && (
                <SourceValueExternal
                    updateDefaultValueTransformers={newTransformers =>
                        updateDefaultValueTransformers(
                            source,
                            currentTransformers,
                            newTransformers,
                        )
                    }
                    value={value}
                />
            )}

            {source === 'fromColumns' && (
                <SourceValueFromColumns
                    updateDefaultValueTransformers={newTransformers =>
                        updateDefaultValueTransformers(
                            source,
                            currentTransformers,
                            newTransformers,
                        )
                    }
                    value={value}
                />
            )}

            {source === 'fromColumnsForSubRessource' && (
                <SourceValueFromColumnsForSubResource
                    updateDefaultValueTransformers={newTransformers =>
                        updateDefaultValueTransformers(
                            source,
                            currentTransformers,
                            newTransformers,
                        )
                    }
                    value={value}
                    selectedSubresourceUri={selectedSubresourceUri}
                />
            )}

            {source === 'fromSubresource' && (
                <SourceValueFromSubResource
                    updateDefaultValueTransformers={newTransformers =>
                        updateDefaultValueTransformers(
                            source,
                            currentTransformers,
                            newTransformers,
                        )
                    }
                    column={value}
                    path={currentTransformers[0].args[0].value}
                />
            )}
        </Box>
    );
};

SourceValueToggle.propTypes = {
    arbitraryMode: PropTypes.bool,
    currentTransformers: PropTypes.arrayOf(PropTypes.object),
    updateTransformers: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selectedSubresourceUri: PropTypes.string,
    subresources: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => {
    const currentTransformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    const subresources = state.subresource.subresources;
    return { currentTransformers, subresources };
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
