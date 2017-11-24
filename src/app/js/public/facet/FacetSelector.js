import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { ToolbarGroup } from 'material-ui/Toolbar';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { fromFacet } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import { selectFacet } from './index';
import FacetValueSelector from './FacetValueSelector';
import getFieldClassName from '../../lib/getFieldClassName';

const anchorOrigin = { horizontal: 'left', vertical: 'bottom' };
const targetOrigin = { horizontal: 'left', vertical: 'top' };

export class FacetSelectorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            showMenu: false,
        };
    }

    handleClick = event => {
        this.setState({
            anchorEl: event.target,
            showMenu: true,
        });
    };

    handleFacetClick = (event, value) => {
        this.setState({ showMenu: false });
        this.props.handleFacetSelected({ field: value });
    };

    handleRequestClose = () => {
        this.setState({ showMenu: false });
    };

    render() {
        const {
            fields,
            hasFacetFields,
            p: polyglot,
            selectedFacet,
        } = this.props;
        const { anchorEl, showMenu } = this.state;

        if (!hasFacetFields) return null;

        return (
            <ToolbarGroup>
                <RaisedButton
                    className="facet-selector"
                    label={
                        selectedFacet
                            ? selectedFacet.label
                            : polyglot.t('add_facet')
                    }
                    onClick={this.handleClick}
                />
                <Popover
                    open={showMenu}
                    anchorEl={anchorEl}
                    anchorOrigin={anchorOrigin}
                    animation={PopoverAnimationVertical}
                    targetOrigin={targetOrigin}
                    onRequestClose={this.handleRequestClose}
                >
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
                </Popover>
                {selectedFacet && <FacetValueSelector />}
            </ToolbarGroup>
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
    handleFacetSelected: selectFacet,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    FacetSelectorComponent,
);
