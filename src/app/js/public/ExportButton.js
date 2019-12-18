import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Menu from '@material-ui/core/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

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
import stylesToClassname from '../lib/stylesToClassName';

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
                <Button primary onClick={handleOpen} className="export">
                    <FontAwesomeIcon icon={faExternalLinkAlt} height={20} />
                    {buttonLabel}
                </Button>
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
                        {exporters.map(({ name }) => (
                            <ExportItem
                                key={name}
                                type={name}
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
