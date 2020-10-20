import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Select, MenuItem, TextField } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import {
    SEARCHED_FIELD_VALUES,
    CUSTOM_ISTEX_QUERY,
} from '../istexSummary/constants';

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

    setSearchedField = (event, index, searchedField) => {
        updateAdminArgs('searchedField', searchedField, this.props);
    };

    setDocumentSortBy = e =>
        updateAdminArgs('documentSortBy', e.target.value, this.props);

    render() {
        const {
            p: polyglot,
            args: { searchedField, documentSortBy },
        } = this.props;

        return (
            <div style={styles.container}>
                <Select
                    className="searched_field"
                    label={polyglot.t('searched_field')}
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

export default translate(IstexCitationAdmin);
