import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';

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
    searchedField: 'host.issn',
};

export const searchedFieldValues = [
    'host.issn',
    'host.eissn',
    'host.isbn',
    'host.eisbn',
    'host.title',
];

export class IstexSummaryAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            searchedField: PropTypes.oneOf(),
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

    render() {
        const { p: polyglot, args: { searchedField } } = this.props;

        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('searched_field')}
                    onChange={this.setSearchedField}
                    style={styles.input}
                    value={searchedField}
                >
                    {searchedFieldValues.map(value => (
                        <MenuItem
                            key={value}
                            value={value}
                            primaryText={polyglot.t(value)}
                        />
                    ))}
                </SelectField>
            </div>
        );
    }
}

export default translate(IstexSummaryAdmin);
