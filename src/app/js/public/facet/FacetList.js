import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { List } from 'material-ui/List';

import { field as fieldPropTypes } from '../../propTypes';
import stylesToClassname from '../../lib/stylesToClassName';
import { facetActions as datasetActions } from '../dataset';
import { facetActions as searchActions } from '../search/reducer';
import FacetActionsContext from './FacetActionsContext';
import { fromFields } from '../../sharedSelectors';
import FacetItem from './FacetItem';

const styles = stylesToClassname(
    {
        list: {
            opacity: '0',
            maxHeight: '0px',
            padding: '0px !important',
            transition: 'max-height 300ms ease-in-out, opacity 600ms ease',
            '@media (min-width: 992px)': {
                opacity: '1',
                maxHeight: '1000px',
                minWidth: '300px',
                flex: 1,
            },
        },
        listOpen: {
            opacity: '1',
            maxHeight: '1000px',
        },
    },
    'facets',
);

const FacetList = ({
    className,
    open,
    hasFacetFields,
    fields,
    page,
    changeFacetValue,
    invertFacet,
    openFacet,
    sortFacetValue,
    toggleFacetValue,
}) => {
    if (!hasFacetFields) {
        return null;
    }

    const actions = {
        changeFacetValue,
        invertFacet,
        openFacet,
        sortFacetValue,
        toggleFacetValue,
    };

    return (
        <List
            className={classnames(className, styles.list, {
                [styles.listOpen]: open,
            })}
        >
            <FacetActionsContext.Provider value={actions}>
                {fields.map(field => (
                    <FacetItem
                        key={`${page}-${field.name}`}
                        field={field}
                        page={page}
                    />
                ))}
            </FacetActionsContext.Provider>
        </List>
    );
};

FacetList.propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool,
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
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(FacetList);
