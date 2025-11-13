import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField } from '@mui/material';
import TableColumnParameter from './TableColumnParameter';
import _ from 'lodash';
import { useTranslate } from '../../../../i18n/I18NContext';

type ColumnParameter = {
    id: number;
    title: string;
    field: string;
    format: {
        name: string;
        option: unknown;
    };
};

type TableColumnsParametersProps = {
    onChange: (args: {
        parameterCount: number;
        parameters: ColumnParameter[];
    }) => void;
    parameterCount: number;
    parameters: ColumnParameter[];
};

const TableColumnsParameters: React.FC<TableColumnsParametersProps> = ({
    onChange,
    parameterCount: initialParameterCount,
    parameters: initialParameters,
}) => {
    const { translate } = useTranslate();
    const reformatParameters = useCallback(
        (
            parameterCount: number,
            parameters: ColumnParameter[],
        ): ColumnParameter[] => {
            const reformattedParameters = [...parameters];
            if (parameterCount > parameters.length) {
                const diff = parameterCount - parameters.length;
                for (let i = 0; i < diff; i++) {
                    reformattedParameters.push({
                        id: parameters.length + i,
                        field: 'a_routine_field',
                        title: 'Column ' + (parameters.length + i + 1),
                        format: {
                            name: '',
                            option: undefined,
                        },
                    });
                }
                return reformattedParameters;
            } else if (parameterCount < parameters.length) {
                return reformattedParameters.slice(0, parameterCount);
            }
            return reformattedParameters;
        },
        [],
    );

    const [parameterCount, setParameterCount] = useState(initialParameterCount);
    const [parameters, setParameters] = useState(() =>
        reformatParameters(initialParameterCount, initialParameters),
    );

    useEffect(() => {
        const newParameters = reformatParameters(
            initialParameterCount,
            initialParameters,
        );
        setParameterCount(initialParameterCount);
        setParameters(newParameters);
    }, [initialParameterCount, initialParameters, reformatParameters]);

    const onParameterChange = useCallback(
        (parameter: ColumnParameter) => {
            const newParameters = [...parameters];
            const index = _.findIndex(newParameters, { id: parameter.id });
            newParameters[index] = parameter;
            const args = {
                parameterCount: parameterCount,
                parameters: newParameters,
            };
            setParameters(newParameters);
            onChange(args);
        },
        [parameters, parameterCount, onChange],
    );

    const onParameterCountChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newParameterCount = parseInt(e.target.value, 10);
            const newParameters = reformatParameters(
                newParameterCount,
                parameters,
            );
            const args = {
                parameterCount: newParameterCount,
                parameters: newParameters,
            };
            setParameterCount(newParameterCount);
            setParameters(newParameters);
            onChange(args);
        },
        [parameters, onChange, reformatParameters],
    );

    return (
        <Box width="100%">
            <TextField
                fullWidth
                type="number"
                label={translate('number_of_column')}
                onChange={onParameterCountChange}
                value={parameterCount}
                variant="standard"
            />
            {parameters.map((parameter, index) => (
                <TableColumnParameter
                    key={`${index}-column-parameter`}
                    parameter={parameter}
                    onParameterChange={onParameterChange}
                />
            ))}
        </Box>
    );
};

export default TableColumnsParameters;
