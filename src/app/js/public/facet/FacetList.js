import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { List } from 'material-ui/List';

import { field as fieldPropTypes } from '../../propTypes';

import { facetActions as datasetActions } from '../dataset';
import { facetActions as searchActions } from '../search/reducer';
import FacetActionsContext from './FacetActionsContext';

import { fromFields } from '../../sharedSelectors';
import getSelectorsForPage from './getSelectorsForPage';
import FacetItem from './FacetItem';

const FacetList = ({
    hasFacetFields,
    fields,
    page,
    changeFacetValue,
    invertFacet,
    openFacet,
    sortFacetValue,
    toggleFacetValue,
}) => {
    if (!hasFacetFields) return null;

    const actions = {
        changeFacetValue,
        invertFacet,
        openFacet,
        sortFacetValue,
        toggleFacetValue,
    };

    const selectors = getSelectorsForPage(page);

    return (
        <List className="facet-list">
            <FacetActionsContext.Provider value={actions}>
                {fields.map(field => (
                    <FacetItem
                        key={`${page}-${field.name}`}
                        field={field}
                        {...selectors}
                    />
                ))}
            </FacetActionsContext.Provider>
        </List>
    );
};

FacetList.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    hasFacetFields: PropTypes.bool.isRequired,
    page: PropTypes.oneOf(['dataset', 'search']).isRequired,
    changeFacetValue: PropTypes.func.isRequired,
    invertFacet: PropTypes.func.isRequired,
    openFacet: PropTypes.func.isRequired,
    sortFacetValue: PropTypes.func.isRequired,
    toggleFacetValue: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    hasFacetFields: fromFields.hasFacetFields(state),
    fields: fromFields.getFacetFields(state),
});

const actionsByPage = {
    dataset: datasetActions,
    search: searchActions,
};

const mapDispatchToProps = (dispatch, { page }) => ({
    changeFacetValue: (...args) =>
        dispatch(actionsByPage[page].changeFacetValue(...args)),
    invertFacet: (...args) =>
        dispatch(actionsByPage[page].invertFacet(...args)),
    openFacet: (...args) => dispatch(actionsByPage[page].openFacet(...args)),
    sortFacetValue: (...args) =>
        dispatch(actionsByPage[page].sortFacetValue(...args)),
    toggleFacetValue: (...args) =>
        dispatch(actionsByPage[page].toggleFacetValue(...args)),
});

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
)(FacetList);
