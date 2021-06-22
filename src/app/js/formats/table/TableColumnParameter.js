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
            type: PropTypes.string.isRequired,
            field: PropTypes.string.isRequired,
        }),
        onParameterChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            id: props.parameter.id,
            title: props.parameter.title,
            type: props.parameter.type,
            field: props.parameter.field,
        };
        this.changeType = this.changeType.bind(this);
        this.changeField = this.changeField.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
    }

    changeType(e) {
        const newType = e.target.value;
        const { id, field, title } = this.state;
        const parameter = {
            id: id,
            title: title,
            type: newType,
            field: field,
        };
        this.setState(parameter);
        this.props.onParameterChange(parameter);
    }

    changeField(e) {
        const newField = e.target.value;
        const { id, type, title } = this.state;
        const parameter = {
            id: id,
            title: title,
            type: type,
            field: newField,
        };
        this.setState(parameter);
        this.props.onParameterChange(parameter);
    }

    changeTitle(e) {
        const newTitle = e.target.value;
        const { id, type, field } = this.state;
        const parameter = {
            id: id,
            title: newTitle,
            type: type,
            field: field,
        };
        this.setState(parameter);
        this.props.onParameterChange(parameter);
    }

    render() {
        const { id, type, field, title } = this.state;
        const polyglot = this.props.polyglot;
        return (
            <div>
                <label style={styles.label20}>{'#' + (id + 1)}</label>
                <div style={styles.div80}>
                    <FormControl style={styles.input50}>
                        <InputLabel>{polyglot.t('type')}</InputLabel>
                        <Select value={type} onChange={this.changeType}>
                            <MenuItem value={'text'}>text</MenuItem>
                            <MenuItem value={'url'}>url</MenuItem>
                        </Select>
                    </FormControl>
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
                            <MenuItem value={'uri'}>
                                {polyglot.t('table_uri')}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <br />
                    <TextField
                        style={styles.input100}
                        value={title}
                        label={polyglot.t('column_title')}
                        onChange={this.changeTitle}
                    />
                </div>
            </div>
        );
    }
}

export default TableColumnParameter;
