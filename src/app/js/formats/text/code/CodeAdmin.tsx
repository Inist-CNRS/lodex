// @ts-expect-error TS6133
import React, { Component } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { translate } from '../../../i18n/I18NContext';

export const defaultArgs = {
    languageToHighlight: '',
};

interface AdminComponentProps {
    args?: {
        languageToHighlight?: string;
    };
    onChange(...args: unknown[]): unknown;
    p: unknown;
}

class AdminComponent extends Component<AdminComponentProps> {
    static defaultProps = {
        args: defaultArgs,
    };

    // @ts-expect-error TS7006
    handleLanguageToHighlight = (languageToHighlight) => {
        this.props.onChange({ languageToHighlight });
    };

    render() {
        const {
            p: polyglot,
            // @ts-expect-error TS2339
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
