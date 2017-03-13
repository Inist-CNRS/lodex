import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import AutoComplete from 'material-ui/AutoComplete';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFacet } from '../selectors';
import { loadFacetValues as loadFacetValuesAction, applyFacet as applyFacetAction } from './index';

export const FacetValueSelectorLargeComponent = ({
    handleChange,
    handleFilterChange,
    values,
    p: polyglot,
    selectedFacet,
}) => (
    <AutoComplete
        dataSource={values}
        onNewRequest={handleChange}
        onUpdateInput={handleFilterChange}
        hintText={polyglot.t('select_facet_value', { facet: selectedFacet.label })}
    />
);

FacetValueSelectorLargeComponent.propTypes = {
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selectedFacet: fieldPropTypes,
};

FacetValueSelectorLargeComponent.defaultProps = {
    selectedFacet: null,
};

const mapStateToProps = state => ({
    selectedFacet: fromFacet.getSelectedFacet(state),
    ...fromFacet.getSelectedFacetValues(state),
});

const mapDispatchToProps = ({
    applyFacet: applyFacetAction,
    loadFacetValues: loadFacetValuesAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleChange: ({ applyFacet }) => (chosenRequest, index) => {
            if (index > 0) {
                applyFacet(chosenRequest);
            }
        },
        handleFilterChange: ({ loadFacetValues, selectedFacet }) => (filter) => {
            loadFacetValues({
                field: selectedFacet.name,
                filter,
            });
        },
    }),
    translate,
)(FacetValueSelectorLargeComponent);
