import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField } from '@mui/material';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    languageToHighlight: '',
};

class AdminComponent extends Component {
    static propTypes = {
        args: PropTypes.shape({
            languageToHighlight: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };
    static defaultProps = {
        args: defaultArgs,
    };

    handleLanguageToHighlight = (languageToHighlight) => {
        this.props.onChange({ languageToHighlight });
    };

    render() {
        const {
            p: polyglot,
            args: { languageToHighlight },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('list_of_language')}
                        onChange={(e) =>
                            this.handleLanguageToHighlight(e.target.value)
                        }
                        value={languageToHighlight}
                    >
                        <MenuItem value="xml">{'XML'}</MenuItem>
                        <MenuItem value="json">{'JSON'}</MenuItem>
                        <MenuItem value="ini">{'INI'}</MenuItem>
                        <MenuItem value="shell">{'Shell'}</MenuItem>
                        <MenuItem value="sql">{'SQL'}</MenuItem>
                        <MenuItem value="javascript">{'Javascript'}</MenuItem>
                    </TextField>
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(AdminComponent);
