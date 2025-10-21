import { Component } from 'react';
import { translate } from '../../../i18n/I18NContext';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';

export const defaultArgs = {
    param: {
        labelArray: [''],
    },
};

interface LodexFieldAdminProps {
    args?: {
        param?: {
            labelArray?: string[];
            hiddenInfo?: object;
        };
    };
    onChange(...args: unknown[]): unknown;
    p: unknown;
}

class LodexFieldAdmin extends Component<LodexFieldAdminProps> {
    static defaultProps = {
        args: defaultArgs,
    };

    // @ts-expect-error TS7006
    handleRequest = (e) => {
        const labelArray = (e.target.value || '').split(';');
        // @ts-expect-error TS2339
        const { param, ...args } = this.props.args;
        const newArgs = { ...args, param: { ...param, labelArray } };
        this.props.onChange(newArgs);
    };

    // @ts-expect-error TS7006
    handleHiddenInfo = (event) => {
        const hiddenInfo = event.target.checked;
        // @ts-expect-error TS2339
        const { param, ...state } = this.props.args;
        const newState = { ...state, param: { ...param, hiddenInfo } };
        this.props.onChange(newState);
    };

    render() {
        const {
            p: polyglot,
            // @ts-expect-error TS2339
            args: { param },
        } = this.props;
        const { labelArray, hiddenInfo } = param || defaultArgs.param;
        const label = labelArray.join(';');

        return (
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet>
                    <TextField
                        // @ts-expect-error TS18046
                        label={polyglot.t('param_labels')}
                        multiline
                        onChange={this.handleRequest}
                        value={label}
                        fullWidth
                    />
                </FormatDataParamsFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={this.handleHiddenInfo}
                                checked={hiddenInfo}
                            />
                        }
                        // @ts-expect-error TS18046
                        label={polyglot.t('hidden_info')}
                    />
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(LodexFieldAdmin);
