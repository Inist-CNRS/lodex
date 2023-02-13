import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField, Box } from '@mui/material';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';

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
                        select
                        label={polyglot.t('select_a_format')}
                        onChange={this.setType}
                        value={type}
                        fullWidth
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
                    </TextField>
                </Box>
                <Box>
                    {type !== 'value' && (
                        <TextField
                            fullWidth
                            label={
                                type !== 'text'
                                    ? 'Custom text'
                                    : "Column's name"
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

export default translate(DefaultAdminComponentWithLabel);
