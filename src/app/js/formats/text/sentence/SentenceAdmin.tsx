import { Component } from 'react';
import { TextField } from '@mui/material';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { translate } from '../../../i18n/I18NContext';

export const defaultArgs = {
    prefix: '',
    suffix: '',
};

interface SentenceAdminProps {
    args?: {
        prefix?: string;
        suffix?: string;
    };
    onChange(...args: unknown[]): unknown;
    p: unknown;
}

class SentenceAdmin extends Component<SentenceAdminProps> {
    static defaultProps = {
        args: defaultArgs,
    };

    // @ts-expect-error TS7006
    handlePrefix = (prefix) => {
        const newArgs = { ...this.props.args, prefix };
        this.props.onChange(newArgs);
    };

    // @ts-expect-error TS7006
    handleSuffix = (suffix) => {
        const newArgs = { ...this.props.args, suffix };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            // @ts-expect-error TS2339
            args: { prefix, suffix },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <TextField
                        key="prefix"
                        // @ts-expect-error TS18046
                        label={polyglot.t('prefix')}
                        onChange={(e) => this.handlePrefix(e.target.value)}
                        value={prefix}
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        key="suffix"
                        // @ts-expect-error TS18046
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
