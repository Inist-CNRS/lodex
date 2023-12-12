import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

export const defaultArgs = {
    prefix: '',
    suffix: '',
};

class SentenceAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            prefix: PropTypes.string,
            suffix: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setPrefix = prefix => {
        const newArgs = { ...this.props.args, prefix };
        this.props.onChange(newArgs);
    };

    setSuffix = suffix => {
        const newArgs = { ...this.props.args, suffix };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { prefix, suffix },
        } = this.props;

        return (
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={1}
                sx={{
                    '& > *': {
                        flexGrow: 1,
                    },
                }}
            >
                <TextField
                    key="prefix"
                    label={polyglot.t('prefix')}
                    onChange={e => this.setPrefix(e.target.value)}
                    value={prefix}
                />
                <TextField
                    key="suffix"
                    label={polyglot.t('suffix')}
                    onChange={e => this.setSuffix(e.target.value)}
                    value={suffix}
                />
            </Box>
        );
    }
}

export default translate(SentenceAdmin);
