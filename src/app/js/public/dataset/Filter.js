import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
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

// export class FilterComponent extends Component {
//     handleFilterChange
// }
export const FilterComponent = ({ getFilter,
                                handleFilterChange,
                                hasSearchableFields,
                                isDatasetLoading,
                                p: polyglot }) =>
            (hasSearchableFields
                ? <ToolbarGroup>
                    <div style={styles.icon}>
                        {isDatasetLoading
                        ? <CircularProgress className="dataset-loading" size={20} />
                        : <ActionSearch />}
                    </div>
                    <TextField
                        className="filter"
                        value={getFilter}
                        hintText={polyglot.t('filter')}
                        onChange={(_, e) => handleFilterChange(e)}
                        style={styles.textbox}
                    />
                </ToolbarGroup>
                : null);

FilterComponent.propTypes = {
    handleFilterChange: PropTypes.func.isRequired,
    hasSearchableFields: PropTypes.bool.isRequired,
    isDatasetLoading: PropTypes.bool.isRequired,
    getFilter: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    isDatasetLoading: fromDataset.isDatasetLoading(state),
    hasSearchableFields: fromFields.hasSearchableFields(state),
    getFilter: fromDataset.getFilter(state),
});

const mapDispatchToProps = ({
    applyFilter: applyFilterAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleFilterChange: ({ applyFilter }) => (match) => {
            applyFilter(match);
        },
    }),
    translate,
)(FilterComponent);
