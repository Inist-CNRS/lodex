import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import AutoComplete from 'material-ui/AutoComplete';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFacet } from '../selectors';
import { applyFacet as applyFacetAction } from './index';

export const FacetValueSelectorSmallComponent = ({
    handleChange,
    values,
    p: polyglot,
    selectedFacet,
}) => (
    <AutoComplete
        dataSource={values}
        onNewRequest={handleChange}
        hintText={polyglot.t('select_facet_value', { facet: selectedFacet.label })}
    />
);

FacetValueSelectorSmallComponent.propTypes = {
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selectedFacet: fieldPropTypes,
};

FacetValueSelectorSmallComponent.defaultProps = {
    selectedFacet: null,
};

const mapStateToProps = state => ({
    selectedFacet: fromFacet.getSelectedFacet(state),
    ...fromFacet.getSelectedFacetValues(state),
});

const mapDispatchToProps = ({
    applyFacet: applyFacetAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleChange: ({ applyFacet }) => (chosenRequest, index) => {
            if (index > 0) {
                applyFacet(chosenRequest);
            }
        },
    }),
    translate,
)(FacetValueSelectorSmallComponent);
