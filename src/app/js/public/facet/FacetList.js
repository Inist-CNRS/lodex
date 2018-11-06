import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { List } from 'material-ui/List';

import { field as fieldPropTypes } from '../../propTypes';

import { fromFields } from '../../sharedSelectors';
import FacetItem from './FacetItem';
import getActionsForPage from './getActionsForPage';

const FacetList = ({ hasFacetFields, fields, page }) => {
    if (!hasFacetFields) return null;
    const props = getActionsForPage(page);

    return (
        <List className="facet-list">
            {fields.map(field => (
                <FacetItem
                    key={`${page}-${field.name}`}
                    field={field}
                    {...props}
                />
            ))}
        </List>
    );
};

FacetList.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    hasFacetFields: PropTypes.bool.isRequired,
    page: PropTypes.oneOf(['dataset', 'search']).isRequired,
};

const mapStateToProps = state => ({
    hasFacetFields: fromFields.hasFacetFields(state),
    fields: fromFields.getFacetFields(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(FacetList);
