import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { MenuItem, TextField, Box } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../shared/updateAdminArgs';
import {
    SEARCHED_FIELD_VALUES,
    CUSTOM_ISTEX_QUERY,
} from '../istexSummary/constants';

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

    setSearchedField = e => {
        updateAdminArgs('searchedField', e.target.value, this.props);
    };

    setDocumentSortBy = e =>
        updateAdminArgs('documentSortBy', e.target.value, this.props);

    render() {
        const {
            p: polyglot,
            args: { searchedField, documentSortBy },
        } = this.props;

        return (
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
            >
                <TextField
                    fullWidth
                    select
                    label={polyglot.t('searched_field')}
                    value={searchedField}
                    onChange={this.setSearchedField}
                >
                    {SEARCHED_FIELD_VALUES.map(value => (
                        <MenuItem key={value} value={value}>
                            {polyglot.t(value)}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    className="document_sort_by"
                    label={polyglot.t('document_sort_by')}
                    onChange={this.setDocumentSortBy}
                    value={documentSortBy}
                    fullWidth
                />
            </Box>
        );
    }
}

export default translate(IstexCitationAdmin);
