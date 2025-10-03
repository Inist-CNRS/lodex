// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem, Button } from '@mui/material';
import { connect } from 'react-redux';
import moment from 'moment';
import { translate } from '../../i18n/I18NContext';
import compose from 'recompose/compose';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { selectVersion } from '../resource';
import { fromResource } from '../selectors';

// @ts-expect-error TS7006
const getFormat = (latest, length) => (dateString, index) =>
    `${moment(dateString).format('L HH:mm:ss')}${
        index === length - 1 ? ` (${latest})` : ''
    }`;

export class SelectVersionComponent extends Component {
    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            showMenu: false,
        };
    }

    // @ts-expect-error TS7006
    getMenuItems = (versions, format) =>
        // @ts-expect-error TS7006
        versions.map((date, index) => (
            <MenuItem
                key={date}
                className={`version version_${index}`}
                value={index}
            >
                {format(date, index)}
            </MenuItem>
        ));

    // @ts-expect-error TS7006
    handleClick = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            showMenu: true,
        });
    };

    // @ts-expect-error TS7006
    handleVersionClick = (event, value) => {
        this.setState({ showMenu: false });
        // @ts-expect-error TS2339
        this.props.onSelectVersion(value);
    };

    handleRequestClose = () => {
        this.setState({ showMenu: false });
    };

    render() {
        // @ts-expect-error TS2339
        const { versions, selectedVersion, p: polyglot } = this.props;
        // @ts-expect-error TS2339
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
                    // @ts-expect-error TS2322
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

// @ts-expect-error TS2339
SelectVersionComponent.propTypes = {
    versions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectVersion: PropTypes.func.isRequired,
    selectedVersion: PropTypes.number.isRequired,
    p: polyglotPropTypes.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    versions: fromResource.getVersions(state),
    // @ts-expect-error TS2339
    selectedVersion: fromResource.getSelectedVersion(state),
});

const mapDispatchToProps = {
    onSelectVersion: selectVersion,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(SelectVersionComponent);
