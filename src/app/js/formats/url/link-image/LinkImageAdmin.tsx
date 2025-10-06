import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
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

class LinkImageAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            type: PropTypes.string,
            value: PropTypes.string,
            maxHeight: PropTypes.number,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    // @ts-expect-error TS7006
    handleType = (e) => {
        // @ts-expect-error TS2339
        const newArgs = { ...this.props.args, type: e.target.value };
        // @ts-expect-error TS2339
        this.props.onChange(newArgs);
    };

    // @ts-expect-error TS7006
    handleValue = (e) => {
        // @ts-expect-error TS2339
        const newArgs = { ...this.props.args, value: e.target.value };
        // @ts-expect-error TS2339
        this.props.onChange(newArgs);
    };

    // @ts-expect-error TS7006
    handleMaxHeight = (e) => {
        const maxHeight = Math.max(e.target.value, 1);
        // @ts-expect-error TS2339
        const newArgs = { ...this.props.args, maxHeight };
        // @ts-expect-error TS2339
        this.props.onChange(newArgs);
    };

    render() {
        const {
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
            args: { type, value, maxHeight },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                {/*
                 // @ts-expect-error TS2322 */}
                <FormatDataParamsFieldSet>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('select_a_format')}
                        onChange={this.handleType}
                        value={type}
                    >
                        <MenuItem value="text">
                            {polyglot.t('item_other_column_content')}
                        </MenuItem>
                        <MenuItem value="column">
                            {polyglot.t('item_custom_url')}
                        </MenuItem>
                    </TextField>
                </FormatDataParamsFieldSet>
                {/*
                 // @ts-expect-error TS2322 */}
                <FormatDefaultParamsFieldSet defaultExpanded>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <TextField
                        label={
                            type !== 'text'
                                ? polyglot.t('Custom URL')
                                : polyglot.t("Column's name")
                        }
                        onChange={this.handleValue}
                        value={value}
                        sx={{ flexGrow: 1 }}
                    />
                    {/*
                     // @ts-expect-error TS2322 */}
                    <TextField
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
