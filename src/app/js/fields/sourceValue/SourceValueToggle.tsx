import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArbitraryIcon from '@mui/icons-material/FormatQuote';
import RoutineIcon from '@mui/icons-material/AccountTree';
import FromColumnsIcon from '@mui/icons-material/ViewColumn';
import FromSubRessourceIcon from '@mui/icons-material/DocumentScanner';
import ProcessingIcon from '@mui/icons-material/Settings';
import SourceValueArbitrary from './SourceValueArbitrary';
import SourceValuePrecomputed from './SourceValuePrecomputed';
import SourceValueFromColumns from './SourceValueFromColumns';
import SourceValueFromColumnsForSubResource from './SourceValueFromColumnsForSubResource';

import {
    Box,
    ToggleButtonGroup,
    ToggleButton as MuiToggleButton,
    Typography,
} from '@mui/material';
import SourceValueFromSubResource from './SourceValueFromSubResource';
import SourceValueRoutine from './SourceValueRoutine';
import { useTranslate } from '../../i18n/I18NContext';
import { useSelector } from 'react-redux';
import type { Transformer, TransformerDraft } from '../types';
import type { SubResource } from '../../admin/subresource';

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
                        value: '',
                    },
                ],
            },
        ],
    ],
    [
        'routine',
        [
            {
                operation: 'ROUTINE',
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
        'precomputed',
        [
            {
                operation: 'PRECOMPUTED',
                args: [
                    {
                        name: 'precomputed',
                        type: 'string',
                    },
                    {
                        name: 'routine',
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
    transformers: Transformer[] | null,
    isSubresourceField: boolean = false,
) => {
    if (!transformers || !transformers[0]?.operation) {
        return { source: null, value: null };
    }

    const transformersOperations = transformers
        .map((t) => t.operation)
        .join('|');

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
        ROUTINE: {
            source: 'routine',
            value: transformers[0]?.args && transformers[0].args[0]?.value,
        },
        PRECOMPUTED: {
            source: 'precomputed',
            value: transformers[0]?.args && transformers[0].args[0]?.value,
            routine: transformers[0]?.args && transformers[0].args[1]?.value,
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
        ? (sourceValues as any)[operation]
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
            backgroundColor: 'var(--primary-secondary)',
        },
        '&.Mui-disabled': {
            backgroundColor: 'var(--neutral-dark-very-light)',
        },
    },
}));

export const SourceValueToggle = ({
    transformers: currentTransformers,
    updateTransformers,
    arbitraryMode,
    selectedSubresourceUri,
}: {
    transformers: Transformer[];
    updateTransformers: (transformers: Omit<Transformer, 'id'>[]) => void;
    arbitraryMode?: boolean;
    selectedSubresourceUri?: string;
}) => {
    const { translate } = useTranslate();
    const subresources = useSelector(
        (state: any) => state.subresource.subresources,
    ) as SubResource[];

    const [source, setSource] = React.useState(null);
    const [value, setValue] = React.useState(null);
    const [routine, setRoutine] = React.useState(undefined);
    React.useEffect(() => {
        const {
            source: currentSource,
            value: currentValue,
            routine: currentRoutine,
        } = GET_SOURCE_VALUE_FROM_TRANSFORMERS(
            currentTransformers,
            !!selectedSubresourceUri,
        );
        setSource(currentSource);
        setValue(currentValue);
        if (currentRoutine) {
            setRoutine(currentRoutine);
        }
    }, [currentTransformers]);

    const updateDefaultValueTransformers = (
        // @ts-expect-error TS7006
        currentSource,
        // @ts-expect-error TS7006
        currentTransformers,
        // @ts-expect-error TS7006
        newTransformers,
    ) => {
        let defaultTransformersLength = 0;
        if (
            currentSource === 'routine' ||
            currentSource === 'arbitrary' ||
            currentSource === 'precomputed' ||
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

    // @ts-expect-error TS7006
    const handleChange = (event, newSource) => {
        if (!newSource) {
            return;
        }

        if (newSource === 'fromSubresource') {
            const transformers: TransformerDraft[] = subresources
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
                                  value: subresources[0].identifier ?? '',
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

    const handleDefaultValueTransformersUpdate = (
        newTransformers: TransformerDraft[],
    ) => {
        updateDefaultValueTransformers(
            source,
            currentTransformers,
            newTransformers,
        );
    };

    return (
        <Box pt={5}>
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                {translate('source_value')}
            </Typography>
            <ToggleButtonGroup
                value={source}
                exclusive
                onChange={handleChange}
                aria-label="Choix de la valeur"
            >
                {/* Raw value */}
                <ToggleButton value="arbitrary">
                    <ArbitraryIcon style={{ fontSize: 50 }} />
                    <Typography variant="caption">
                        {translate('arbitrary_value')}
                    </Typography>
                </ToggleButton>

                {/* Routine */}
                <ToggleButton value="routine">
                    <RoutineIcon style={{ fontSize: 50 }} />
                    <Typography variant="caption">
                        {translate('routine_value')}
                    </Typography>
                </ToggleButton>

                <ToggleButton disabled={!arbitraryMode} value="precomputed">
                    <ProcessingIcon style={{ fontSize: 50 }} />
                    <Typography variant="caption">
                        {translate('precomputed_processing')}
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
                        {translate('from_columns')}
                    </Typography>
                </ToggleButton>
                {!selectedSubresourceUri && (
                    <ToggleButton
                        value="fromSubresource"
                        // @ts-expect-error TS2365
                        disabled={!subresources.length > 0 || arbitraryMode}
                    >
                        <FromSubRessourceIcon style={{ fontSize: 50 }} />
                        <Typography variant="caption">
                            {translate('from_subresource')}
                        </Typography>
                    </ToggleButton>
                )}
            </ToggleButtonGroup>

            {source === 'arbitrary' && (
                <SourceValueArbitrary
                    updateDefaultValueTransformers={
                        handleDefaultValueTransformersUpdate
                    }
                    // @ts-expect-error TS2322
                    value={value}
                />
            )}

            {source === 'routine' && (
                <SourceValueRoutine
                    updateDefaultValueTransformers={
                        handleDefaultValueTransformersUpdate
                    }
                    value={value}
                />
            )}

            {source === 'precomputed' && (
                <SourceValuePrecomputed
                    updateDefaultValueTransformers={
                        handleDefaultValueTransformersUpdate
                    }
                    value={value}
                    routine={routine}
                />
            )}

            {source === 'fromColumns' && (
                <SourceValueFromColumns
                    updateDefaultValueTransformers={
                        handleDefaultValueTransformersUpdate
                    }
                    value={value}
                />
            )}

            {source === 'fromColumnsForSubRessource' && (
                <SourceValueFromColumnsForSubResource
                    updateDefaultValueTransformers={
                        handleDefaultValueTransformersUpdate
                    }
                    value={value}
                    selectedSubresourceUri={selectedSubresourceUri}
                />
            )}

            {source === 'fromSubresource' && (
                <SourceValueFromSubResource
                    updateDefaultValueTransformers={
                        handleDefaultValueTransformersUpdate
                    }
                    column={value}
                    path={currentTransformers[0]?.args?.[0]?.value}
                />
            )}
        </Box>
    );
};

export default SourceValueToggle;
