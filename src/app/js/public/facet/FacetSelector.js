import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { fromFacet } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import { openFacet } from './index';
import FacetValueSelector from './FacetValueSelector';
import getFieldClassName from '../../lib/getFieldClassName';

export class FacetSelectorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            showMenu: false,
        };
    }

    handleFacetClick = (event, value) => {
        this.props.handleFacetSelected({ field: value });
    };

    handleRequestClose = () => {
        this.setState({ showMenu: false });
    };

    render() {
        const { fields, hasFacetFields, selectedFacet } = this.props;

        if (!hasFacetFields) return null;

        return (
            <div>
                <Menu onChange={this.handleFacetClick}>
                    {fields.map(field => (
                        <MenuItem
                            className={`facet-${getFieldClassName(field)}`}
                            key={field.name}
                            primaryText={field.label}
                            value={field}
                        />
                    ))}
                </Menu>
                {selectedFacet && (
                    <div>
                        <FacetValueSelector />
                    </div>
                )}
            </div>
        );
    }
}

FacetSelectorComponent.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    handleFacetSelected: PropTypes.func.isRequired,
    hasFacetFields: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    selectedFacet: fieldPropTypes,
};

FacetSelectorComponent.defaultProps = {
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
    FacetSelectorComponent,
);
