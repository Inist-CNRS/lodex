import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Popover, Menu, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import translate from 'redux-polyglot/translate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromExport } from './selectors';
import theme from '../theme';
import ExportItem from './export/ExportMenuItem';
import stylesToClassname from '../lib/stylesToClassName';

import {
    preLoadExporters,
    exportPublishedDataset as exportPublishedDatasetAction,
} from './export';

const styles = stylesToClassname(
    {
        menuContainer: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: '16px',
        },
        menuTitle: {
            padding: '0px 16px',
            margin: '0px',
        },
        menuList: {
            padding: '0px 24px',
            margin: '0px',
        },
    },
    'export',
);

const ExportButton = ({ exporters, onExport, uri, p: polyglot, withText }) => {
    if (!exporters || !exporters.length) {
        return null;
    }

    const [popover, setPopover] = useState({ open: false });

    const handleOpen = event => {
        // This prevents ghost click.
        event.preventDefault();

        setPopover({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    const handleClose = () => {
        setPopover({
            open: false,
        });
    };

    const handleExport = event => {
        handleClose();
        onExport(event);
    };

    const buttonLabel = polyglot.t('export');
    const menuTitle = polyglot.t(uri ? 'export_resource' : 'export_results');

    return (
        <>
            {withText ? (
                <Button
                    variant="text"
                    color="primary"
                    onClick={handleOpen}
                    label={buttonLabel}
                    startIcon={
                        <FontAwesomeIcon icon={faExternalLinkAlt} height={20} />
                    }
                    className="export"
                />
            ) : (
                <IconButton
                    tooltip={buttonLabel}
                    onClick={handleOpen}
                    iconStyle={{ color: theme.green.primary }}
                    className="export"
                >
                    <FontAwesomeIcon icon={faExternalLinkAlt} height={20} />
                </IconButton>
            )}
            <Popover
                open={popover.open}
                anchorEl={popover.anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                onRequestClose={handleClose}
            >
                <div className={styles.menuContainer}>
                    <h3 className={styles.menuTitle}>{menuTitle}</h3>
                    <Menu className={styles.menuList}>
                        {exporters.map(({ exportID, label }) => (
                            <ExportItem
                                key={exportID}
                                label={label}
                                exportID={exportID}
                                uri={uri}
                                onClick={handleExport}
                            />
                        ))}
                    </Menu>
                </div>
            </Popover>
        </>
    );
};

ExportButton.propTypes = {
    exporters: PropTypes.arrayOf(PropTypes.object),
    onExport: PropTypes.func.isRequired,
    preLoadExporters: PropTypes.func.isRequired,
    uri: PropTypes.string,
    p: polyglotPropTypes.isRequired,
    withText: PropTypes.bool.isRequired,
};

ExportButton.defaultProps = {
    withText: false,
};

const mapStateToProps = state => ({
    exporters: fromExport.getExporters(state),
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            preLoadExporters,
            onExport: exportPublishedDatasetAction,
        },
        dispatch,
    );

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ExportButton);
