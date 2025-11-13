import React, { useState, useCallback } from 'react';
import { Box, MenuItem, TextField } from '@mui/material';
import SelectFormat from '../../../SelectFormat';
import {
    COMPATIBLE_FORMATS,
    getAdminComponent,
    getFormatInitialArgs,
} from '../../../getFormat';
import { useTranslate } from '../../../../i18n/I18NContext';

type ColumnParameterFormat = {
    name: string;
    option: unknown;
};

type ColumnParameter = {
    id: number;
    title: string;
    field: string;
    format: ColumnParameterFormat;
};

type TableColumnParameterProps = {
    parameter: ColumnParameter;
    onParameterChange: (parameter: ColumnParameter) => void;
};

const TableColumnParameter: React.FC<TableColumnParameterProps> = ({
    parameter,
    onParameterChange,
}) => {
    const { translate } = useTranslate();
    const { id } = parameter;
    const [title, setTitle] = useState(parameter.title);
    const [format, setFormat] = useState(parameter.format);
    const [field, setField] = useState(parameter.field);

    const changeFormat = useCallback(
        (newFormat: string) => {
            const newFormatObj = {
                name: newFormat,
                option: getFormatInitialArgs(newFormat),
            };
            const parameter = {
                id,
                title,
                format: newFormatObj,
                field,
            };
            setFormat(newFormatObj);
            onParameterChange(parameter);
        },
        [id, title, field, onParameterChange],
    );

    const changeFormatOption = useCallback(
        (newFormatOption: unknown) => {
            const newFormatObj = {
                name: format.name,
                option: newFormatOption,
            };
            const parameter = {
                id,
                title,
                format: newFormatObj,
                field,
            };
            setFormat(newFormatObj);
            onParameterChange(parameter);
        },
        [id, title, format.name, field, onParameterChange],
    );

    const changeField = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newField = e.target.value;
            const parameter = {
                id,
                title,
                format,
                field: newField,
            };
            setField(newField);
            onParameterChange(parameter);
        },
        [id, title, format, onParameterChange],
    );

    const changeTitle = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newTitle = e.target.value;
            const parameter = {
                id,
                title: newTitle,
                format,
                field,
            };
            setTitle(newTitle);
            onParameterChange(parameter);
        },
        [id, format, field, onParameterChange],
    );

    const SubAdminComponent = getAdminComponent(format.name);

    const availableField = [
        'title',
        'summary',
        'detail1',
        'detail2',
        'detail3',
        'source',
        'target',
        'weight',
        'value',
        'url',
        'id',
    ];

    return (
        <Box display="flex" alignItems="center">
            <Box component="label" mr={1}>
                {'#' + (id + 1)}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    gap: 2,
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: 1,
                    marginTop: 1,
                    borderLeft: '1px solid grey',
                    borderRadius: '2px',
                }}
            >
                <Box display="flex" gap="1rem">
                    <TextField
                        select
                        label={translate('table_field')}
                        value={field}
                        onChange={changeField}
                        sx={{ flexGrow: 1 }}
                        variant="standard"
                    >
                        {availableField.map((value) => (
                            <MenuItem
                                key={`table_parameter_${value}`}
                                value={value}
                            >
                                {translate(`table_${value}`)}
                            </MenuItem>
                        ))}
                        <MenuItem
                            value={
                                availableField.includes(field) ? 'other' : field
                            }
                        >
                            {translate('table_other')}
                        </MenuItem>
                    </TextField>
                    <TextField
                        value={title}
                        label={translate('column_title')}
                        onChange={changeTitle}
                        sx={{ flexGrow: 1 }}
                        variant="standard"
                    />
                </Box>
                {!availableField.includes(field) && (
                    <TextField
                        fullWidth
                        value={field}
                        label={translate('table_other_field')}
                        onChange={changeField}
                        variant="standard"
                    />
                )}
                <SelectFormat
                    formats={COMPATIBLE_FORMATS}
                    value={format.name}
                    onChange={changeFormat}
                />
                {format.name && (
                    <SubAdminComponent
                        onChange={changeFormatOption}
                        // @ts-expect-error Complex union type from getAdminComponent
                        args={format.option}
                    />
                )}
            </Box>
        </Box>
    );
};

export default TableColumnParameter;
