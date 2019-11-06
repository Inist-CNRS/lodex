import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import withWidth from 'material-ui/utils/withWidth';
import ExportIcon from 'material-ui/svg-icons/editor/vertical-align-bottom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import translate from 'redux-polyglot/translate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromExport } from './selectors';
import {
    preLoadExporters,
    exportPublishedDataset as exportPublishedDatasetAction,
} from './export';
import theme from '../theme';
import ExportItem from './export/ExportMenuItem';

const ExportButton = ({
    exporters,
    handleExportClick,
    uri,
    p: polyglot,
    width,
}) => {
    const [popover, setPopover] = useState({ open: false });

    const handleClick = event => {
        // This prevents ghost click.
        event.preventDefault();

        setPopover({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    const handleRequestClose = () => {
        setPopover({
            open: false,
        });
    };

    if (!exporters || !exporters.length) {
        return null;
    }

    const exportLabel = uri ? 'export_resource' : 'export_resultset';
    const label = width > 1 ? polyglot.t(exportLabel) : '';

    return (
        <>
            {width > 2 && (
                <FlatButton
                    primary
                    onClick={handleClick}
                    label={label}
                    icon={<FontAwesomeIcon icon={faDownload} height={20} />}
                    className="export"
                />
            )}
            {width <= 2 && (
                <IconButton
                    onClick={handleClick}
                    iconStyle={{ color: theme.green.primary }}
                    className="export"
                >
                    <FontAwesomeIcon icon={faDownload} height={20} />
                </IconButton>
            )}

            <Popover
                open={popover.open}
                anchorEl={popover.anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                onRequestClose={handleRequestClose}
                animation={PopoverAnimationVertical}
            >
                <Menu>
                    {exporters.map(({ name }) => (
                        <ExportItem
                            key={name}
                            type={name}
                            uri={uri}
                            onClick={handleExportClick}
                        />
                    ))}
                </Menu>
            </Popover>
        </>
    );
};

ExportButton.propTypes = {
    exporters: PropTypes.arrayOf(PropTypes.object),
    handleExportClick: PropTypes.func.isRequired,
    preLoadExporters: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    uri: PropTypes.string,
    width: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    exporters: fromExport.getExporters(state),
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            preLoadExporters,
            handleExportClick: exportPublishedDatasetAction,
        },
        dispatch,
    );

export default compose(
    withWidth(),
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
)(ExportButton);
