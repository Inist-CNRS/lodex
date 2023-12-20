import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { Box, TextField, MenuItem } from '@mui/material';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../utils/components/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/FormatGroupedFieldSet';

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

    setType = e => {
        const newArgs = { ...this.props.args, type: e.target.value };
        this.props.onChange(newArgs);
    };

    setValue = e => {
        const newArgs = { ...this.props.args, value: e.target.value };
        this.props.onChange(newArgs);
    };

    setMaxHeight = e => {
        const maxHeight = Math.max(e.target.value, 1);
        const newArgs = { ...this.props.args, maxHeight };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { type, value, maxHeight },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet>
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('select_a_format')}
                        onChange={this.setType}
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
                <FormatDefaultParamsFieldSet>
                    <TextField
                        label={
                            type !== 'text'
                                ? polyglot.t('Custom URL')
                                : polyglot.t("Column's name")
                        }
                        onChange={this.setValue}
                        value={value}
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        label={polyglot.t('height_px')}
                        type="number"
                        onChange={this.setMaxHeight}
                        value={maxHeight}
                        sx={{ flexGrow: 1 }}
                    />
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(LinkImageAdmin);
