import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { MenuItem, TextField } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../utils/updateAdminArgs';
import {
    SEARCHED_FIELD_VALUES,
    SORT_YEAR_VALUES,
    CUSTOM_ISTEX_QUERY,
    SORT_YEAR_DESC,
} from './constants';
import { FormatDataParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    searchedField: CUSTOM_ISTEX_QUERY,
    sortDir: SORT_YEAR_DESC,
    yearThreshold: 50,
    documentSortBy: 'host.pages.first,title.raw',
};

export class IstexSummaryAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            searchedField: PropTypes.oneOf(SEARCHED_FIELD_VALUES),
            sortDir: PropTypes.oneOf(SORT_YEAR_VALUES),
            yearThreshold: PropTypes.number,
            documentSortBy: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    handleSearchedField = (e) => {
        updateAdminArgs('searchedField', e.target.value, this.props);
    };

    handleSortDir = (e) => {
        updateAdminArgs('sortDir', e.target.value, this.props);
    };

    handleYearThreshold = (e) =>
        updateAdminArgs(
            'yearThreshold',
            parseInt(e.target.value, 10),
            this.props,
        );

    handleDocumentSortBy = (e) =>
        updateAdminArgs('documentSortBy', e.target.value, this.props);

    render() {
        const {
            p: polyglot,
            args: { searchedField, sortDir, yearThreshold, documentSortBy },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet defaultExpanded>
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('searched_field')}
                        value={searchedField}
                        onChange={this.handleSearchedField}
                        className="searched_field"
                    >
                        {SEARCHED_FIELD_VALUES.map((value) => (
                            <MenuItem key={value} value={value}>
                                {polyglot.t(value)}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        select
                        label={polyglot.t('year_sort_dir')}
                        value={sortDir}
                        onChange={this.handleSortDir}
                        className="year_sort_dir"
                    >
                        {SORT_YEAR_VALUES.map((value) => (
                            <MenuItem key={value} value={value}>
                                {polyglot.t(value)}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        className="year_threshold"
                        type="number"
                        label={polyglot.t('year_threshold')}
                        onChange={this.handleYearThreshold}
                        value={yearThreshold}
                        fullWidth
                    />
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

export default translate(IstexSummaryAdmin);
