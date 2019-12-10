import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
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
        menu: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        menuTitle: {
            padding: '5px',
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

    const buttonLabel = polyglot.t(
        uri ? 'export_resource' : 'export_resultset',
    );

    return (
        <>
            {withText ? (
                <FlatButton
                    primary
                    onClick={handleOpen}
                    label={buttonLabel}
                    icon={
                        <FontAwesomeIcon icon={faExternalLinkAlt} height={20} />
                    }
                    className="export"
                />
            ) : (
                <IconButton
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
                animation={PopoverAnimationVertical}
            >
                <div className={styles.menuContainer}>
                    <h4 className={styles.menuTitle}>
                        {polyglot.t('export_in')}
                    </h4>
                    <Menu>
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
