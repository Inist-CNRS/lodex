import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { TextField, SelectField, MenuItem } from '@material-ui/core';
import { polyglot as polyglotPropTypes } from '../../propTypes';

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

class UriAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            type: PropTypes.oneOf(['value', 'text', 'column']),
            value: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setType = (_, __, type) => {
        const newArgs = { ...this.props.args, type };
        this.props.onChange(newArgs);
    };

    setValue = (_, value) => {
        const newArgs = { ...this.props.args, value };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { type, value },
        } = this.props;

        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('uri_format_select_type')}
                    onChange={this.setType}
                    style={styles.input}
                    value={type}
                >
                    <MenuItem value="value">
                        {polyglot.t('uri_format_column')}
                    </MenuItem>
                    <MenuItem value="text">
                        {polyglot.t('uri_format_custom')}
                    </MenuItem>
                    <MenuItem value="column">
                        {polyglot.t('uri_format_another_column')}
                    </MenuItem>
                </SelectField>

                {type !== 'value' && (
                    <TextField
                        floatingLabelText={
                            type !== 'text'
                                ? polyglot.t('uri_format_custom_value')
                                : polyglot.t('uri_format_another_column_value')
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

export default translate(UriAdmin);
