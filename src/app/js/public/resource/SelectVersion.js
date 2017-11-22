import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import { connect } from 'react-redux';
import moment from 'moment';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { selectVersion } from '../resource';
import { fromResource } from '../selectors';

const getFormat = (latest, length) => (dateString, index) =>
    `${moment(dateString).format('L HH:mm:ss')}${
        index === length - 1 ? ` (${latest})` : ''
    }`;

const staticProps = {
    anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
    targetOrigin: { horizontal: 'left', vertical: 'top' },
};

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
                primaryText={format(date, index)}
            />
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
                <FlatButton
                    className="select-version"
                    label={format(versions[selectedVersion], selectedVersion)}
                    labelPosition="before"
                    onClick={this.handleClick}
                    icon={<ArrowDown />}
                />
                <Popover
                    open={showMenu}
                    onRequestClose={this.handleRequestClose}
                    anchorEl={anchorEl}
                    anchorOrigin={staticProps.anchorOrigin}
                    targetOrigin={staticProps.targetOrigin}
                >
                    <Menu onChange={this.handleVersionClick}>
                        {this.getMenuItems(versions, format)}
                    </Menu>
                </Popover>
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

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    SelectVersionComponent,
);
