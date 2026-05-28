import { useState } from 'react';
import { Menu, Button, MenuItem, Tooltip } from '@mui/material';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import compose from 'recompose/compose';

import { fromDisplayConfig, fromExport, fromSearch } from './selectors';
import ExportItem from './export/ExportMenuItem';
import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';

import { exportPublishedDataset as exportPublishedDatasetAction } from './export';

import PDFApi from './api/exportPDF';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';
import { fromI18n } from '@lodex/frontend-common/sharedSelectors';

const styles = stylesToClassname(
    {
        menuContainer: {
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1003,
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

interface ExportButtonProps {
    exporters?: object[];
    onExport(...args: unknown[]): unknown;
    uri?: string;
    p: any;
    isResourceExport: boolean;
    displayExportPDF?: boolean;
    maxExportPDFSize?: number;
    match?: string;
    facets: Record<string, unknown>;
    locale: string;
    sort?: any;
    invertedFacets?: string[];
}

const getExportTooltip = (exportID: unknown) => {
    const id = String(exportID).toLowerCase();

    if (id.includes('full')) {
        return 'Exporte l’ensemble des données des ressources, y compris celles non affichées sur les pages ressources mais utilisées pour certains traitements, visualisations ou enrichissements.';
    }

    if (id.includes('csv') || id.includes('tsv')) {
        return 'Exporte uniquement les données issues des champs affichés sur les pages ressources.';
    }

    return '';
};

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
}: ExportButtonProps) => {
    const [popover, setPopover] = useState({ open: false });

    // @ts-expect-error TS7006
    const handleOpen = (event) => {
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

            <div className={styles.menuContainer}>
                <Menu
                    className={styles.menuList}
                    // @ts-expect-error TS2339
                    anchorEl={popover.anchorEl}
                    keepMounted
                    open={popover.open}
                    onClose={handleClose}
                >
                    <h3 className={styles.menuTitle}>{menuTitle}</h3>

                    {exporters.map(({ exportID, label }) => (
                        <Tooltip
                            key={exportID}
                            title={getExportTooltip(exportID)}
                            arrow
                            placement="right"
                        >
                            <span style={{ display: 'block' }}>
                                <ExportItem
                                    label={label}
                                    exportID={exportID}
                                    uri={uri}
                                    onClick={handleExport}
                                />
                            </span>
                        </Tooltip>
                    ))}

                    {displayExportPDF && !isResourceExport && (
                        <MenuItem onClick={handleExportPDF}>PDF</MenuItem>
                    )}
                </Menu>
            </div>
        </>
    );
};

// @ts-expect-error TS7006
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
