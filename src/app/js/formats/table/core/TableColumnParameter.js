import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { Box, MenuItem, TextField } from '@mui/material';
import SelectFormat from '../../SelectFormat';
import {
    COMPATIBLE_FORMATS,
    getAdminComponent,
    getFormatInitialArgs,
} from '../../index';

class TableColumnParameter extends Component {
    static propTypes = {
        polyglot: polyglotPropTypes.isRequired,
        parameter: PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            field: PropTypes.string.isRequired,
            format: PropTypes.shape({
                name: PropTypes.string.isRequired,
                option: PropTypes.any.isRequired,
            }).isRequired,
        }),
        onParameterChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            id: props.parameter.id,
            title: props.parameter.title,
            format: props.parameter.format,
            field: props.parameter.field,
        };
        this.changeFormat = this.changeFormat.bind(this);
        this.changeFormatOption = this.changeFormatOption.bind(this);
        this.changeField = this.changeField.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
    }

    changeFormat(newFormat) {
        const { id, field, title } = this.state;
        const parameter = {
            id: id,
            title: title,
            format: {
                name: newFormat,
                option: getFormatInitialArgs(newFormat),
            },
            field: field,
        };
        this.setState(parameter);
        this.props.onParameterChange(parameter);
    }

    changeFormatOption(newFormatOption) {
        const { id, field, title, format } = this.state;
        const parameter = {
            id: id,
            title: title,
            format: {
                name: format.name,
                option: newFormatOption,
            },
            field: field,
        };
        this.setState(parameter);
        this.props.onParameterChange(parameter);
    }

    changeField(e) {
        const newField = e.target.value;
        const { id, format, title } = this.state;
        const parameter = {
            id: id,
            title: title,
            format: format,
            field: newField,
        };
        this.setState(parameter);
        this.props.onParameterChange(parameter);
    }

    changeTitle(e) {
        const newTitle = e.target.value;
        const { id, format, field } = this.state;
        const parameter = {
            id: id,
            title: newTitle,
            format: format,
            field: field,
        };
        this.setState(parameter);
        this.props.onParameterChange(parameter);
    }

    render() {
        const { id, format, field, title } = this.state;
        const polyglot = this.props.polyglot;

        const SubAdminComponent = getAdminComponent(format.name);

        const availableField = [
            'title',
            'summary',
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
                    <Box display="flex" gap={1}>
                        <TextField
                            select
                            label={polyglot.t('table_field')}
                            value={field}
                            onChange={this.changeField}
                            sx={{ flexGrow: 1 }}
                        >
                            {availableField.map(value => (
                                <MenuItem
                                    key={`table_parameter_${value}`}
                                    value={value}
                                >
                                    {polyglot.t(`table_${value}`)}
                                </MenuItem>
                            ))}
                            <MenuItem
                                value={
                                    availableField.includes(field)
                                        ? 'other'
                                        : field
                                }
                            >
                                {polyglot.t('table_other')}
                            </MenuItem>
                        </TextField>
                        <TextField
                            value={title}
                            label={polyglot.t('column_title')}
                            onChange={this.changeTitle}
                            sx={{ flexGrow: 1 }}
                        />
                    </Box>
                    {!availableField.includes(field) && (
                        <TextField
                            fullWidth
                            value={field}
                            label={polyglot.t('table_other_field')}
                            onChange={this.changeField}
                        />
                    )}
                    <SelectFormat
                        formats={COMPATIBLE_FORMATS}
                        value={format.name}
                        onChange={this.changeFormat}
                    />
                    {format.name && (
                        <SubAdminComponent
                            onChange={this.changeFormatOption}
                            args={format.option}
                        />
                    )}
                </Box>
            </Box>
        );
    }
}

export default TableColumnParameter;
