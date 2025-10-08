// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from '../../../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
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

class LodexFieldAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            param: PropTypes.shape({
                labelArray: PropTypes.arrayOf(PropTypes.string),
                hiddenInfo: PropTypes.object,
            }),
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    // @ts-expect-error TS7006
    handleRequest = (e) => {
        const labelArray = (e.target.value || '').split(';');
        // @ts-expect-error TS2339
        const { param, ...args } = this.props.args;
        const newArgs = { ...args, param: { ...param, labelArray } };
        // @ts-expect-error TS2339
        this.props.onChange(newArgs);
    };

    // @ts-expect-error TS7006
    handleHiddenInfo = (event) => {
        const hiddenInfo = event.target.checked;
        // @ts-expect-error TS2339
        const { param, ...state } = this.props.args;
        const newState = { ...state, param: { ...param, hiddenInfo } };
        // @ts-expect-error TS2339
        this.props.onChange(newState);
    };

    render() {
        const {
            // @ts-expect-error TS2339
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
                        label={polyglot.t('hidden_info')}
                    />
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(LodexFieldAdmin);
