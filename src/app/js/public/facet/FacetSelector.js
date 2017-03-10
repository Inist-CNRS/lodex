import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { ToolbarGroup } from 'material-ui/Toolbar';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFacet, fromPublication } from '../selectors';
import { selectFacet } from './index';
import FacetValueSelector from './FacetValueSelector';

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

    handleClick = (event) => {
        this.setState({
            anchorEl: event.target,
            showMenu: true,
        });
    }

    handleFacetClick = (event, value) => {
        this.setState({ showMenu: false });
        this.props.handleFacetSelected({ field: value });
    }

    handleRequestClose = () => {
        this.setState({ showMenu: false });
    }

    render() {
        const { fields, p: polyglot, selectedFacet } = this.props;
        const { anchorEl, showMenu } = this.state;

        return (
            <ToolbarGroup>
                <RaisedButton
                    label={selectedFacet ? selectedFacet.label : polyglot.t('add_facet')}
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
                                key={field.name}
                                primaryText={field.label}
                                value={field}
                            />
                        ))}
                    </Menu>
                </Popover>
                {selectedFacet &&
                    <FacetValueSelector />
                }
            </ToolbarGroup>
        );
    }
}

FacetSelectorComponent.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    handleFacetSelected: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selectedFacet: fieldPropTypes,
};

FacetSelectorComponent.defaultProps = {
    selectedFacet: null,
};

const mapStateToProps = state => ({
    selectedFacet: fromFacet.getSelectedFacet(state),
    fields: fromPublication.getFacetFields(state),
});

const mapDispatchToProps = ({
    handleFacetSelected: selectFacet,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(FacetSelectorComponent);
