import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from '../../../i18n/I18NContext';
import { MenuItem, TextField } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../utils/updateAdminArgs';
import {
    SEARCHED_FIELD_VALUES,
    CUSTOM_ISTEX_QUERY,
} from '../istexSummary/constants';
import { FormatDataParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    searchedField: CUSTOM_ISTEX_QUERY,
    documentSortBy: 'publicationDate[desc]',
};

export class IstexCitationAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            searchedField: PropTypes.oneOf(SEARCHED_FIELD_VALUES),
            documentSortBy: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    // @ts-expect-error TS7006
    handleSearchedField = (e) => {
        updateAdminArgs('searchedField', e.target.value, this.props);
    };

    // @ts-expect-error TS7006
    handleDocumentSortBy = (e) =>
        updateAdminArgs('documentSortBy', e.target.value, this.props);

    render() {
        const {
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
            args: { searchedField, documentSortBy },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                {/*
                 // @ts-expect-error TS2322 */}
                <FormatDataParamsFieldSet defaultExpanded>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('searched_field')}
                        value={searchedField}
                        onChange={this.handleSearchedField}
                    >
                        {SEARCHED_FIELD_VALUES.map((value) => (
                            <MenuItem key={value} value={value}>
                                {polyglot.t(value)}
                            </MenuItem>
                        ))}
                    </TextField>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <TextField
                        className="document_sort_by"
                        label={polyglot.t('document_sort_by')}
                        onChange={this.handleDocumentSortBy}
                        value={documentSortBy}
                        fullWidth
                    />
                </FormatDataParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(IstexCitationAdmin);
