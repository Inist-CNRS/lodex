import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, Button, MenuItem } from '@mui/material';
import translate from 'redux-polyglot/translate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import compose from 'recompose/compose';

import { polyglot as polyglotPropTypes } from '../propTypes';
import {
    fromDisplayConfig,
    fromExport,
    fromI18n,
    fromSearch,
} from './selectors';
import ExportItem from './export/ExportMenuItem';
import stylesToClassname from '../lib/stylesToClassName';

import { exportPublishedDataset as exportPublishedDatasetAction } from './export';

import PDFApi from './api/exportPDF';

const styles = stylesToClassname(
    {
        menuContainer: {
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1003, // on top of Navbar (with zIndex 1002)
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

const ExportButton = ({
    exporters,
    onExport,
    uri,
    p: polyglot,
    isResourceExport,
    displayExportPDF,
    maxExportPDFSize,
    match,
    facets,
    locale,
    invertedFacets,
    sort,
}) => {
    if (!exporters || !exporters.length) {
        return null;
    }

    const [popover, setPopover] = useState({ open: false });

    const handleOpen = (event) => {
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

    const handleExport = (event) => {
        handleClose();
        onExport(event);
    };

    const handleExportPDF = async () => {
        handleClose();

        const facetsIds = Object.keys(facets).reduce((acc, facetName) => {
            acc[facetName] = facets[facetName].map(
                (facetValue) => facetValue.id,
            );
            return acc;
        }, {});

        const options = {
            match,
            facets: facetsIds,
            sort,
            uri,
            invertedFacets,
            locale,
            perPage: maxExportPDFSize,
        };

        try {
            const response = await PDFApi.exportPDF(options);

            // Detect if the user is on a mobile device and redirect to the PDF
            if (
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent,
                )
            ) {
                window.location.replace(URL.createObjectURL(response));
            } else {
                window.open(URL.createObjectURL(response));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const buttonLabel = polyglot.t('export');
    const menuTitle = polyglot.t(uri ? 'export_resource' : 'export_results');

    return (
        <>
            <Button
                variant="text"
                onClick={handleOpen}
                className="export"
                startIcon={<DownloadIcon />}
                endIcon={<ArrowDropDownIcon />}
            >
                {buttonLabel}
            </Button>
            <div className={styles.menuContainer}>
                <Menu
                    className={styles.menuList}
                    anchorEl={popover.anchorEl}
                    keepMounted
                    open={popover.open}
                    onClose={handleClose}
                >
                    <h3 className={styles.menuTitle}>{menuTitle}</h3>
                    {exporters.map(({ exportID, label }) => (
                        <ExportItem
                            key={exportID}
                            label={label}
                            exportID={exportID}
                            uri={uri}
                            onClick={handleExport}
                        />
                    ))}
                    {displayExportPDF && !isResourceExport && (
                        <MenuItem onClick={handleExportPDF}>PDF</MenuItem>
                    )}
                </Menu>
            </div>
        </>
    );
};

ExportButton.propTypes = {
    exporters: PropTypes.arrayOf(PropTypes.object),
    onExport: PropTypes.func.isRequired,
    uri: PropTypes.string,
    p: polyglotPropTypes.isRequired,
    isResourceExport: PropTypes.bool.isRequired,
    displayExportPDF: PropTypes.bool,
    maxExportPDFSize: PropTypes.number,
    match: PropTypes.string,
    facets: PropTypes.arrayOf(PropTypes.object),
    locale: PropTypes.string.isRequired,
    sort: PropTypes.any,
    invertedFacets: PropTypes.arrayOf(PropTypes.string),
};

ExportButton.defaultProps = {
    isResourceExport: false,
};

const mapStateToProps = (state) => ({
    exporters: fromExport.getExporters(state),
    displayExportPDF: fromDisplayConfig.getDisplayExportPDF(state),
    maxExportPDFSize: fromDisplayConfig.getMaxExportPDFSize(state),
    facets: fromSearch.getAppliedFacets(state),
    match: fromSearch.getQuery(state),
    invertedFacets: fromSearch.getInvertedFacetKeys(state),
    sort: fromSearch.getSort(state),
    locale: fromI18n.getLocale(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            onExport: exportPublishedDatasetAction,
        },
        dispatch,
    );

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ExportButton);
