import { Component } from 'react';
import { TextField, MenuItem } from '@mui/material';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { translate } from '../../../i18n/I18NContext';

export const defaultArgs = {
    type: 'value',
    value: '',
    maxHeight: 200,
};

interface LinkImageAdminProps {
    args?: {
        type?: string;
        value?: string;
        maxHeight?: number;
    };
    onChange(...args: unknown[]): unknown;
    p: unknown;
}

class LinkImageAdmin extends Component<LinkImageAdminProps> {
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

    // @ts-expect-error TS7006
    handleMaxHeight = (e) => {
        const maxHeight = Math.max(e.target.value, 1);
        const newArgs = { ...this.props.args, maxHeight };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            // @ts-expect-error TS2339
            args: { type, value, maxHeight },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet>
                    <TextField
                        fullWidth
                        select
                        // @ts-expect-error TS18046
                        label={polyglot.t('select_a_format')}
                        onChange={this.handleType}
                        value={type}
                    >
                        <MenuItem value="text">
                            {/*
                             // @ts-expect-error TS18046 */}
                            {polyglot.t('item_other_column_content')}
                        </MenuItem>
                        <MenuItem value="column">
                            {/*
                             // @ts-expect-error TS18046 */}
                            {polyglot.t('item_custom_url')}
                        </MenuItem>
                    </TextField>
                </FormatDataParamsFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <TextField
                        label={
                            type !== 'text'
                                ? // @ts-expect-error TS18046
                                  polyglot.t('Custom URL')
                                : // @ts-expect-error TS18046
                                  polyglot.t("Column's name")
                        }
                        onChange={this.handleValue}
                        value={value}
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        // @ts-expect-error TS18046
                        label={polyglot.t('height_px')}
                        type="number"
                        onChange={this.handleMaxHeight}
                        value={maxHeight}
                        sx={{ flexGrow: 1 }}
                    />
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(LinkImageAdmin);
