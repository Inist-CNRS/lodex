import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import debounce from 'lodash.debounce';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';
import { ToolbarGroup } from 'material-ui/Toolbar';
import ActionSearch from 'material-ui/svg-icons/action/search';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { applyFilter as applyFilterAction } from './';
import { fromDataset } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        icon: {
            margin: '8px 8px 0px 8px',
        },
        textbox: {
            fontSize: '1.5rem',
        },
    },
    'filter',
);

const muiStyles = {
    searchBarUnderline: {
        borderColor: theme.orange.primary,
    },
};

class FilterComponent extends Component {
    state = {
        query: this.props.filter,
    };

    debouncedApplyFilter = debounce(value => {
        this.props.applyFilter(value);
    }, 500);

    handleFilterChange = (_, value) => {
        this.setState({ query: value });
        this.debouncedApplyFilter(value);
    };

    handleClearFilter = () => {
        this.handleFilterChange(null, '');
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
                <div className={styles.icon}>
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
                    className={classnames('filter', styles.textbox)}
                    value={query !== null ? query : filter}
                    hintText={polyglot.t('filter')}
                    onChange={this.handleFilterChange}
                    underlineStyle={muiStyles.searchBarUnderline}
                    underlineFocusStyle={muiStyles.searchBarUnderline}
                />
                <IconButton
                    className="filter-clear"
                    iconStyle={{ color: theme.green.primary }}
                    onClick={this.handleClearFilter}
                >
                    <FontAwesomeIcon icon={faUndo} height={15} />
                </IconButton>
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
