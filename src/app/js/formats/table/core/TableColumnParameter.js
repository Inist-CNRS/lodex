import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core';
import SelectFormat from '../../SelectFormat';
import {
    TABLE_COMPATIBLE_FORMATS,
    getAdminComponent,
    getFormatInitialArgs,
} from '../../index';

const styles = {
    input50: {
        width: '50%',
    },
    input100: {
        width: '100%',
    },
    container: {
        width: '80%',
        display: 'inline-block',
        'padding-left': '2%',
        margin: '2%',
        'border-left': '1px solid grey',
        'border-radius': '2px',
    },
    labelId: {
        'margin-right': '4%',
        display: 'inline-block',
    },
};

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
            <div>
                <label style={styles.labelId}>{'#' + (id + 1)}</label>
                <div style={styles.container}>
                    <FormControl style={styles.input50}>
                        <InputLabel>{polyglot.t('table_field')}</InputLabel>
                        <Select value={field} onChange={this.changeField}>
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
                        </Select>
                    </FormControl>
                    <TextField
                        style={styles.input50}
                        value={title}
                        label={polyglot.t('column_title')}
                        onChange={this.changeTitle}
                    />
                    {!availableField.includes(field) ? (
                        <>
                            <br />
                            <TextField
                                style={styles.input100}
                                value={field}
                                label={polyglot.t('table_other_field')}
                                onChange={this.changeField}
                            />
                            <br />
                        </>
                    ) : (
                        <br />
                    )}
                    <FormControl style={styles.input100}>
                        <SelectFormat
                            formats={TABLE_COMPATIBLE_FORMATS}
                            value={format.name}
                            onChange={this.changeFormat}
                        />
                        <SubAdminComponent
                            style={styles.input100}
                            onChange={this.changeFormatOption}
                            args={format.option}
                        />
                    </FormControl>
                </div>
            </div>
        );
    }
}

export default TableColumnParameter;
