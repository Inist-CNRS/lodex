import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';

export const defaultArgs = {
    param: {
        labelArray: [''],
    },
};

class LodexFieldAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            param: PropTypes.shape({
                labelArray: PropTypes.arrayOf(PropTypes.string),
                hiddenInfo: PropTypes.object,
            }),
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setRequest = e => {
        const labelArray = (e.target.value || '').split(';');
        const { param, ...args } = this.props.args;
        const newArgs = { ...args, param: { ...param, labelArray } };
        this.props.onChange(newArgs);
    };

    setHiddenInfo = event => {
        let hiddenInfo = event.target.checked;
        const { param, ...state } = this.props.args;
        const newState = { ...state, param: { ...param, hiddenInfo } };
        this.props.onChange(newState);
    };

    render() {
        const {
            p: polyglot,
            args: { param },
        } = this.props;
        const { labelArray, hiddenInfo } = param || defaultArgs.param;
        const label = labelArray.join(';');

        return (
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
            >
                <TextField
                    label={polyglot.t('param_labels')}
                    multiline
                    onChange={this.setRequest}
                    value={label}
                    fullWidth
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={this.setHiddenInfo}
                            checked={hiddenInfo}
                        />
                    }
                    label={polyglot.t('hidden_info')}
                />
            </Box>
        );
    }
}

export default translate(LodexFieldAdmin);
