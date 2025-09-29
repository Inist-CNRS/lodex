// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { translate } from '../../../i18n/I18NContext';

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

    // @ts-expect-error TS7006
    handlePrefix = (prefix) => {
        // @ts-expect-error TS2339
        const newArgs = { ...this.props.args, prefix };
        // @ts-expect-error TS2339
        this.props.onChange(newArgs);
    };

    // @ts-expect-error TS7006
    handleSuffix = (suffix) => {
        // @ts-expect-error TS2339
        const newArgs = { ...this.props.args, suffix };
        // @ts-expect-error TS2339
        this.props.onChange(newArgs);
    };

    render() {
        const {
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
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
