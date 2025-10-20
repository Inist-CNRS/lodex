// @ts-expect-error TS6133
import React, { Component } from 'react';
import { TextField } from '@mui/material';
import { translate } from '../../../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    delimiter: '',
};

interface LatexAdminProps {
    args?: {
        delimiter?: string;
    };
    onChange(...args: unknown[]): unknown;
    p: unknown;
}

class LatexAdmin extends Component<LatexAdminProps> {
    static defaultProps = {
        args: defaultArgs,
    };

    // @ts-expect-error TS7006
    handleDelimiter = (e) => {
        const delimiter = String(e.target.value);
        const newArgs = { ...this.props.args, delimiter };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            // @ts-expect-error TS2339
            args: { delimiter },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <TextField
                        label={polyglot.t('choose_delimiter')}
                        type="string"
                        onChange={this.handleDelimiter}
                        value={delimiter}
                        fullWidth
                    />
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(LatexAdmin);
