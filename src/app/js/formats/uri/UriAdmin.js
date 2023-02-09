import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { MenuItem, TextField, Box } from '@mui/material';
import { polyglot as polyglotPropTypes } from '../../propTypes';

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
            <Box
                display="flex"
                gap={1}
                sx={{
                    '& > *': {
                        flexBasis: '50%',
                    },
                }}
            >
                <Box>
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('uri_format_select_type')}
                        onChange={this.setType}
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
                    </TextField>
                </Box>
                <Box>
                    {type !== 'value' && (
                        <TextField
                            fullWidth
                            label={
                                type !== 'text'
                                    ? polyglot.t('uri_format_custom_value')
                                    : polyglot.t(
                                          'uri_format_another_column_value',
                                      )
                            }
                            onChange={this.setValue}
                            value={value}
                        />
                    )}
                </Box>
            </Box>
        );
    }
}

export default translate(UriAdmin);
