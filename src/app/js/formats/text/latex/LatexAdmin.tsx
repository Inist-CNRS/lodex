import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { translate } from '../../../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    delimiter: '',
};

class LatexAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            delimiter: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    // @ts-expect-error TS7006
    handleDelimiter = (e) => {
        const delimiter = String(e.target.value);
        // @ts-expect-error TS2339
        const newArgs = { ...this.props.args, delimiter };
        // @ts-expect-error TS2339
        this.props.onChange(newArgs);
    };

    render() {
        const {
            // @ts-expect-error TS2339
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
