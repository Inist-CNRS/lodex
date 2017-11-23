import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import memoize from 'lodash.memoize';

import { isLongText, getShortText } from '../../lib/longTexts';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { fromFacet } from '../selectors';
import {
    loadFacetValues as loadFacetValuesAction,
    applyFacet as applyFacetAction,
} from './index';

const getMenuText = memoize(text => {
    if (isLongText(text, 25)) {
        return getShortText(text, 25);
    }

    return text;
});

export const getValues = memoize(facets =>
    facets.map(facet => ({
        text: facet.value,
        value: (
            <MenuItem
                className={`facet-value-${facet.value.toLowerCase()}`}
                primaryText={getMenuText(facet.value)}
                title={facet.value}
                secondaryText={facet.count}
                value={facet.value}
            />
        ),
    })),
);

export const FacetValueSelectorComponent = ({
    handleChange,
    handleFilterChange,
    values,
    p: polyglot,
    selectedFacet,
}) => (
    <AutoComplete
        className="facet-value-selector"
        dataSource={getValues(values)}
        onNewRequest={handleChange}
        onUpdateInput={handleFilterChange}
        openOnFocus
        hintText={polyglot.t('select_facet_value', {
            facet: selectedFacet.label,
        })}
        filter={AutoComplete.fuzzyFilter}
    />
);

FacetValueSelectorComponent.propTypes = {
    values: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selectedFacet: fieldPropTypes,
};

FacetValueSelectorComponent.defaultProps = {
    selectedFacet: null,
};

const mapStateToProps = state => ({
    selectedFacet: fromFacet.getSelectedFacet(state),
    ...fromFacet.getSelectedFacetValues(state),
});

const mapDispatchToProps = {
    applyFacet: applyFacetAction,
    loadFacetValues: loadFacetValuesAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleChange: ({ applyFacet, selectedFacet: field }) => (
            { text: value },
            index,
        ) => {
            if (index > -1) {
                applyFacet({ field, value });
            }
        },
        handleFilterChange: ({
            loadFacetValues,
            selectedFacet: field,
        }) => filter => {
            loadFacetValues({
                field,
                filter,
            });
        },
    }),
    translate,
)(FacetValueSelectorComponent);
