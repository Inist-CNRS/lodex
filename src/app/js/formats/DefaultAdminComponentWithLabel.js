import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    MenuItem,
    Select,
    TextField,
    FormControl,
    InputLabel,
} from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';

const styles = {
    container: {
        display: 'inline-flex',
    },
    input: {
        marginLeft: '1rem',
    },
};

export const defaultArgs = {
    type: 'value',
    value: '',
};

class DefaultAdminComponentWithLabel extends Component {
    static propTypes = {
        args: PropTypes.shape({
            type: PropTypes.string,
            value: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setType = e => {
        const newArgs = { ...this.props.args, type: e.target.value };
        this.props.onChange(newArgs);
    };

    setValue = e => {
        const newArgs = { ...this.props.args, value: e.target.value };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { type, value },
        } = this.props;

        return (
            <div style={styles.container}>
                <FormControl fullWidth>
                    <InputLabel>{polyglot.t('select_a_format')}</InputLabel>
                    <Select
                        onChange={this.setType}
                        style={styles.input}
                        value={type}
                    >
                        <MenuItem value="value">
                            {polyglot.t('item_column_content')}
                        </MenuItem>
                        <MenuItem value="text">
                            {polyglot.t('item_custom_text')}
                        </MenuItem>
                        <MenuItem value="column">
                            {polyglot.t('item_other_column_content')}
                        </MenuItem>
                    </Select>
                </FormControl>
                {type !== 'value' && (
                    <TextField
                        label={
                            type !== 'text' ? 'Custom text' : "Column's name"
                        }
                        onChange={this.setValue}
                        style={styles.input}
                        value={value}
                    />
                )}
            </div>
        );
    }
}

export default translate(DefaultAdminComponentWithLabel);
