import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

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

    handlePrefix = (prefix) => {
        const newArgs = { ...this.props.args, prefix };
        this.props.onChange(newArgs);
    };

    handleSuffix = (suffix) => {
        const newArgs = { ...this.props.args, suffix };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { prefix, suffix },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <TextField
                        key="prefix"
                        label={polyglot.t('prefix')}
                        onChange={(e) => this.handlePrefix(e.target.value)}
                        value={prefix}
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        key="suffix"
                        label={polyglot.t('suffix')}
                        onChange={(e) => this.handleSuffix(e.target.value)}
                        value={suffix}
                        sx={{ flexGrow: 1 }}
                    />
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(SentenceAdmin);
