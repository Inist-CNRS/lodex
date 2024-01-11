import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import SelectFormat from '../../SelectFormat';
import { getAdminComponent, FORMATS, getFormatInitialArgs } from '../../index';
import {
    FormatDefaultParamsFieldSet,
    FormatSubFormatParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    type: 'unordered',
    subFormat: 'none',
    subFormatOptions: {},
};

class ListAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            type: PropTypes.string,
            subFormat: PropTypes.string,
            subFormatOptions: PropTypes.any,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    handleType = type => {
        const newArgs = { ...this.props.args, type };
        this.props.onChange(newArgs);
    };

    handleSubFormat = subFormat => {
        const newArgs = {
            ...this.props.args,
            subFormat,
            args: getFormatInitialArgs(subFormat),
        };
        this.props.onChange(newArgs);
    };

    handleSubFormatOptions = subFormatOptions => {
        const newArgs = {
            ...this.props.args,
            subFormatOptions,
        };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            args: { type, subFormat, subFormatOptions },
        } = this.props;

        const SubAdminComponent = getAdminComponent(subFormat);

        return (
            <FormatGroupedFieldSet>
                <FormatDefaultParamsFieldSet>
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('list_format_select_type')}
                        onChange={e => this.handleType(e.target.value)}
                        value={type}
                    >
                        <MenuItem value="unordered">
                            {polyglot.t('list_format_unordered')}
                        </MenuItem>
                        <MenuItem value="ordered">
                            {polyglot.t('list_format_ordered')}
                        </MenuItem>
                        <MenuItem value="unordered_without_bullet">
                            {polyglot.t('list_format_unordered_without_bullet')}
                        </MenuItem>
                        <MenuItem value="unordered_flat">
                            {polyglot.t('list_format_unordered_flat')}
                        </MenuItem>
                    </TextField>
                    <div
                        style={{
                            width: '100%',
                        }}
                    >
                        <SelectFormat
                            formats={FORMATS}
                            value={subFormat}
                            onChange={this.handleSubFormat}
                        />
                    </div>
                </FormatDefaultParamsFieldSet>
                <FormatSubFormatParamsFieldSet>
                    {subFormat && subFormat !== 'none' ? (
                        <SubAdminComponent
                            onChange={this.handleSubFormatOptions}
                            args={subFormatOptions}
                        />
                    ) : (
                        polyglot.t('no_format')
                    )}
                </FormatSubFormatParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(ListAdmin);
