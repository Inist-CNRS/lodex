import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, Button, MenuItem } from '@mui/material';
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
import { translate } from '../i18n/I18NContext';

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
    // @ts-expect-error TS7031
    exporters,
    // @ts-expect-error TS7031
    onExport,
    // @ts-expect-error TS7031
    uri,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    isResourceExport,
    // @ts-expect-error TS7031
    displayExportPDF,
    // @ts-expect-error TS7031
    maxExportPDFSize,
    // @ts-expect-error TS7031
    match,
    // @ts-expect-error TS7031
    facets,
    // @ts-expect-error TS7031
    locale,
    // @ts-expect-error TS7031
    invertedFacets,
    // @ts-expect-error TS7031
    sort,
}) => {
    const [popover, setPopover] = useState({ open: false });

    // @ts-expect-error TS7006
    const handleOpen = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        setPopover({
            open: true,
            // @ts-expect-error TS2353
            anchorEl: event.currentTarget,
        });
    };

    const handleClose = () => {
        setPopover({
            open: false,
        });
    };

    // @ts-expect-error TS7006
    const handleExport = (event) => {
        handleClose();
        onExport(event);
    };

    const handleExportPDF = async () => {
        handleClose();

        const facetsIds = Object.keys(facets).reduce((acc, facetName) => {
            // @ts-expect-error TS7053
            acc[facetName] = facets[facetName].map(
                // @ts-expect-error TS7006
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

    if (!exporters || !exporters.length) {
        return null;
    }

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
            {/*
             // @ts-expect-error TS2339 */}
            <div className={styles.menuContainer}>
                <Menu
                    // @ts-expect-error TS2339
                    className={styles.menuList}
                    // @ts-expect-error TS2339
                    anchorEl={popover.anchorEl}
                    keepMounted
                    open={popover.open}
                    onClose={handleClose}
                >
                    {/*
                     // @ts-expect-error TS2339 */}
                    <h3 className={styles.menuTitle}>{menuTitle}</h3>
                    {/*
                     // @ts-expect-error TS7031 */}
                    {exporters.map(({ exportID, label }) => (
                        <ExportItem
                            key={exportID}
                            // @ts-expect-error TS2322
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    exporters: fromExport.getExporters(state),
    // @ts-expect-error TS2339
    displayExportPDF: fromDisplayConfig.getDisplayExportPDF(state),
    // @ts-expect-error TS2339
    maxExportPDFSize: fromDisplayConfig.getMaxExportPDFSize(state),
    // @ts-expect-error TS2339
    facets: fromSearch.getAppliedFacets(state),
    // @ts-expect-error TS2339
    match: fromSearch.getQuery(state),
    // @ts-expect-error TS2339
    invertedFacets: fromSearch.getInvertedFacetKeys(state),
    // @ts-expect-error TS2339
    sort: fromSearch.getSort(state),
    // @ts-expect-error TS2339
    locale: fromI18n.getLocale(state),
});

// @ts-expect-error TS7006
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
    // @ts-expect-error TS2345
)(ExportButton);
