import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import debounce from 'lodash.debounce';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { applyFilter as applyFilterAction } from '.';
import { fromDataset } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import stylesToClassname from '../../lib/stylesToClassName';
import SearchBar from '../../lib/components/searchbar/SearchBar';
import ToggleFacetsButton from '../../lib/components/searchbar/ToggleFacetsButton';

const styles = stylesToClassname(
    {
        toggleFacetsButton: {
            '@media (min-width: 992px)': {
                display: 'none !important',
            },
        },
    },
    'dataset-searchbar',
);

class DatasetSearchBar extends Component {
    state = {
        query: this.props.query || '',
    };

    debouncedApplyFilter = debounce(value => {
        this.props.search(value);
    }, 500);

    handleFilterChange = (_, value) => {
        this.setState({ query: value });
        this.debouncedApplyFilter(value);
    };

    handleClearFilter = () => {
        this.handleFilterChange(null, '');
    };

    render() {
        const { hasSearchableFields, onToggleFacets } = this.props;
        const { query } = this.state;

        if (!hasSearchableFields) {
            return null;
        }

        return (
            <SearchBar
                value={query}
                onChange={this.handleFilterChange}
                onClear={this.handleClearFilter}
                actions={
                    <ToggleFacetsButton
                        onChange={onToggleFacets}
                        className={styles.toggleFacetsButton}
                    />
                }
            />
        );
    }
}

DatasetSearchBar.defaultProps = {
    query: '',
};

DatasetSearchBar.propTypes = {
    p: polyglotPropTypes.isRequired,
    hasSearchableFields: PropTypes.bool.isRequired,
    search: PropTypes.func.isRequired,
    query: PropTypes.string,
    onToggleFacets: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    hasSearchableFields: fromFields.hasSearchableFields(state),
    query: fromDataset.getFilter(state),
});

const mapDispatchToProps = {
    search: applyFilterAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DatasetSearchBar);
