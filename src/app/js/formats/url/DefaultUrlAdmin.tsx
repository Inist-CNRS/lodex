// @ts-expect-error TS6133
import React, { Component } from 'react';
import { translate } from '../../i18n/I18NContext';
import { MenuItem, TextField } from '@mui/material';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { FormatDefaultParamsFieldSet } from '../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    type: 'value',
    value: '',
};

interface DefaultUrlAdminProps {
    args?: {
        type?: "value" | "text" | "column";
        value?: string;
    };
    onChange(...args: unknown[]): unknown;
    p: unknown;
}

class DefaultUrlAdmin extends Component<DefaultUrlAdminProps> {
    static defaultProps = {
        args: defaultArgs,
    };

    // @ts-expect-error TS7006
    handleType = (e) => {
        const newArgs = { ...this.props.args, type: e.target.value };
        this.props.onChange(newArgs);
    };

    // @ts-expect-error TS7006
    handleValue = (e) => {
        const newArgs = { ...this.props.args, value: e.target.value };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            // @ts-expect-error TS2339
            args: { type, value },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('label_format_select_type')}
                        onChange={this.handleType}
                        value={type}
                    >
                        <MenuItem value="value">
                            {polyglot.t('label_format_column')}
                        </MenuItem>
                        <MenuItem value="text">
                            {polyglot.t('label_format_custom')}
                        </MenuItem>
                        <MenuItem value="column">
                            {polyglot.t('label_format_another_column')}
                        </MenuItem>
                    </TextField>
                    {type !== 'value' && (
                        <TextField
                            fullWidth
                            label={
                                type === 'text'
                                    ? polyglot.t('label_format_custom_value')
                                    : polyglot.t(
                                          'label_format_another_column_value',
                                      )
                            }
                            onChange={this.handleValue}
                            value={value}
                        />
                    )}
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(DefaultUrlAdmin);
