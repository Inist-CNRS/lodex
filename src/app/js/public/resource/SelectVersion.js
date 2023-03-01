import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem, Button } from '@mui/material';
import { connect } from 'react-redux';
import moment from 'moment';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { selectVersion } from '../resource';
import { fromResource } from '../selectors';

const getFormat = (latest, length) => (dateString, index) =>
    `${moment(dateString).format('L HH:mm:ss')}${
        index === length - 1 ? ` (${latest})` : ''
    }`;

export class SelectVersionComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            showMenu: false,
        };
    }

    getMenuItems = (versions, format) =>
        versions.map((date, index) => (
            <MenuItem
                key={date}
                className={`version version_${index}`}
                value={index}
            >
                {format(date, index)}
            </MenuItem>
        ));

    handleClick = event => {
        this.setState({
            anchorEl: event.currentTarget,
            showMenu: true,
        });
    };

    handleVersionClick = (event, value) => {
        this.setState({ showMenu: false });
        this.props.onSelectVersion(value);
    };

    handleRequestClose = () => {
        this.setState({ showMenu: false });
    };

    render() {
        const { versions, selectedVersion, p: polyglot } = this.props;
        const { showMenu, anchorEl } = this.state;

        const format = getFormat(polyglot.t('latest'), versions.length);

        return (
            <div>
                <Button
                    variant="text"
                    className="select-version"
                    onClick={this.handleClick}
                    endIcon={<ArrowDown />}
                >
                    {format(versions[selectedVersion], selectedVersion)}
                </Button>
                <Menu
                    onChange={this.handleVersionClick}
                    anchorEl={anchorEl}
                    keepMounted
                    open={showMenu}
                    onClose={this.handleRequestClose}
                >
                    {this.getMenuItems(versions, format)}
                </Menu>
            </div>
        );
    }
}

SelectVersionComponent.propTypes = {
    versions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectVersion: PropTypes.func.isRequired,
    selectedVersion: PropTypes.number.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    versions: fromResource.getVersions(state),
    selectedVersion: fromResource.getSelectedVersion(state),
});

const mapDispatchToProps = {
    onSelectVersion: selectVersion,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(SelectVersionComponent);
