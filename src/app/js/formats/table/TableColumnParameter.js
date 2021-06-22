import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core';
import SelectFormat from '../SelectFormat';
import { TABLE_COMPATIBLE_FORMATS, getAdminComponent } from '../index';

const styles = {
    input50: {
        width: '50%',
    },
    input100: {
        width: '100%',
    },
    div80: {
        width: '80%',
        display: 'inline-block',
    },
    label20: {
        width: '20%',
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
        const { id, field, title, format } = this.state;
        const parameter = {
            id: id,
            title: title,
            format: {
                name: newFormat,
                option: format.option,
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

        return (
            <div>
                <label style={styles.label20}>{'#' + (id + 1)}</label>
                <div style={styles.div80}>
                    <FormControl style={styles.input50}>
                        <InputLabel>{polyglot.t('table_field')}</InputLabel>
                        <Select value={field} onChange={this.changeField}>
                            <MenuItem value={'title'}>
                                {polyglot.t('table_title')}
                            </MenuItem>
                            <MenuItem value={'summary'}>
                                {polyglot.t('table_summary')}
                            </MenuItem>
                            <MenuItem value={'source'}>
                                {polyglot.t('table_source')}
                            </MenuItem>
                            <MenuItem value={'target'}>
                                {polyglot.t('table_target')}
                            </MenuItem>
                            <MenuItem value={'weight'}>
                                {polyglot.t('table_weight')}
                            </MenuItem>
                            <MenuItem value={'value'}>
                                {polyglot.t('table_value')}
                            </MenuItem>
                            <MenuItem value={'url'}>
                                {polyglot.t('table_url')}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        style={styles.input50}
                        value={title}
                        label={polyglot.t('column_title')}
                        onChange={this.changeTitle}
                    />
                    <br />
                    <FormControl style={styles.input100}>
                        <SelectFormat
                            formats={TABLE_COMPATIBLE_FORMATS}
                            value={format.name}
                            onChange={this.changeFormat}
                        />
                        <SubAdminComponent
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
