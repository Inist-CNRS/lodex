import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import debounce from 'lodash.debounce';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';
import { ToolbarGroup } from 'material-ui/Toolbar';
import ActionSearch from 'material-ui/svg-icons/action/search';
import CircularProgress from 'material-ui/CircularProgress';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { applyFilter as applyFilterAction } from './';
import { fromDataset } from '../selectors';
import { fromFields } from '../../sharedSelectors';

const styles = {
    icon: {
        marginLeft: 16,
        marginRight: 8,
        marginTop: 8,
    },
    textbox: {
        fontSize: '1.5rem',
    },
};

class FilterComponent extends Component {
    state = {
        query: null,
    };

    componentDidUpdate(prevProps) {
        // Reset query when switching to another graph
        if (!!prevProps.filter && !this.props.filter && !!this.state.query) {
            this.setState({ query: null });
        }
    }

    debouncedApplyFilter = debounce(value => {
        this.props.applyFilter(value);
    }, 500);

    handleFilterChange = (_, value) => {
        this.setState({ query: value });
        this.debouncedApplyFilter(value);
    };

    render() {
        const {
            filter,
            hasSearchableFields,
            isDatasetLoading,
            p: polyglot,
        } = this.props;
        const { query } = this.state;

        if (!hasSearchableFields) {
            return null;
        }

        return (
            <ToolbarGroup>
                <div style={styles.icon}>
                    {isDatasetLoading ? (
                        <CircularProgress
                            className="dataset-loading"
                            size={20}
                        />
                    ) : (
                        <ActionSearch />
                    )}
                </div>
                <TextField
                    className="filter"
                    value={query !== null ? query : filter}
                    hintText={polyglot.t('filter')}
                    onChange={this.handleFilterChange}
                    style={styles.textbox}
                />
            </ToolbarGroup>
        );
    }
}

FilterComponent.defaultProps = {
    filter: '',
};

FilterComponent.propTypes = {
    applyFilter: PropTypes.func.isRequired,
    hasSearchableFields: PropTypes.bool.isRequired,
    isDatasetLoading: PropTypes.bool.isRequired,
    filter: PropTypes.string,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    isDatasetLoading: fromDataset.isDatasetLoading(state),
    hasSearchableFields: fromFields.hasSearchableFields(state),
    filter: fromDataset.getFilter(state),
});

const mapDispatchToProps = {
    applyFilter: applyFilterAction,
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
)(FilterComponent);
