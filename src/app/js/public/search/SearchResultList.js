import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import {
    field as fieldProptypes,
    resource as resourcePropTypes,
} from '../../propTypes';
import SearchResult from './SearchResult';

class SearchResultList extends Component {
    shouldComponentUpdate(nextProps) {
        return !isEqual(nextProps.results, this.props.results);
    }
    render() {
        const { results, fields, fieldNames, closeDrawer } = this.props;
        return results.map(result => (
            <SearchResult
                key={result.uri}
                fields={fields}
                fieldNames={fieldNames}
                result={result}
                closeDrawer={closeDrawer}
            />
        ));
    }
}

SearchResultList.propTypes = {
    results: PropTypes.arrayOf(resourcePropTypes).isRequired,
    fieldNames: PropTypes.shape({
        uri: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
    fields: PropTypes.arrayOf(fieldProptypes).isRequired,
    closeDrawer: PropTypes.func.isRequired,
};

export default SearchResultList;
