import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import {
    Select,
    MenuItem,
    TextField,
    FormControl,
    InputLabel,
} from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import {
    SEARCHED_FIELD_VALUES,
    SORT_YEAR_VALUES,
    CUSTOM_ISTEX_QUERY,
    SORT_YEAR_DESC,
} from './constants';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
};

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
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setSearchedField = e => {
        updateAdminArgs('searchedField', e.target.value, this.props);
    };

    setSortDir = e => {
        updateAdminArgs('sortDir', e.target.value, this.props);
    };

    setYearThreshold = e =>
        updateAdminArgs(
            'yearThreshold',
            parseInt(e.target.value, 10),
            this.props,
        );

    setDocumentSortBy = e =>
        updateAdminArgs('documentSortBy', e.target.value, this.props);

    render() {
        const {
            p: polyglot,
            args: { searchedField, sortDir, yearThreshold, documentSortBy },
        } = this.props;

        return (
            <div style={styles.container}>
                <FormControl>
                    <InputLabel id="istex-summary-searchfield-input-label">
                        {polyglot.t('searched_field')}
                    </InputLabel>
                    <Select
                        className="searched_field"
                        labelId="istex-summary-searchfield-input-label"
                        onChange={this.setSearchedField}
                        style={styles.input}
                        value={searchedField}
                    >
                        {SEARCHED_FIELD_VALUES.map(value => (
                            <MenuItem key={value} value={value}>
                                {polyglot.t(value)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="istex-summary-yearsort-input-label">
                        {polyglot.t('year_sort_dir')}
                    </InputLabel>
                    <Select
                        className="year_sort_dir"
                        labelId="istex-summary-yearsort-input-label"
                        onChange={this.setSortDir}
                        style={styles.input}
                        value={sortDir}
                    >
                        {SORT_YEAR_VALUES.map(value => (
                            <MenuItem key={value} value={value}>
                                {polyglot.t(value)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    className="year_threshold"
                    type="number"
                    label={polyglot.t('year_threshold')}
                    onChange={this.setYearThreshold}
                    style={styles.input}
                    value={yearThreshold}
                />
                <TextField
                    className="document_sort_by"
                    label={polyglot.t('document_sort_by')}
                    onChange={this.setDocumentSortBy}
                    style={styles.input}
                    value={documentSortBy}
                />
            </div>
        );
    }
}

export default translate(IstexSummaryAdmin);
