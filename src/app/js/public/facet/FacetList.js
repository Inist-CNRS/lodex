import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { List } from 'material-ui/List';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { fromFacet } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import { openFacet } from './index';
import FacetItem from './FacetItem';

export class PureFacetList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            showMenu: false,
        };
    }

    render() {
        const { fields, hasFacetFields } = this.props;

        if (!hasFacetFields) return null;

        return (
            <List className="facet-list">
                {fields.map(field => (
                    <FacetItem key={field.name} field={field} />
                ))}
            </List>
        );
    }
}

PureFacetList.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    handleFacetSelected: PropTypes.func.isRequired,
    hasFacetFields: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    selectedFacet: fieldPropTypes,
};

PureFacetList.defaultProps = {
    selectedFacet: null,
};

const mapStateToProps = state => ({
    hasFacetFields: fromFields.hasFacetFields(state),
    selectedFacet: fromFacet.getSelectedFacet(state),
    fields: fromFields.getFacetFields(state),
});

const mapDispatchToProps = {
    handleFacetSelected: openFacet,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    PureFacetList,
);
