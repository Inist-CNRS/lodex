import AddIcon from '@mui/icons-material/Add';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { default as React, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';

import { exportFields } from '../../../exportFields';
import { useTranslate } from '../../../i18n/I18NContext';
import { fromFields } from '../../../sharedSelectors';
import { importFields } from '../../import';
import { fromParsing, fromPublication } from '../../selectors';

export const ModelNestedMenuComponent = React.memo(
    function AnnotationNestedMenu({
        // @ts-expect-error TS2339
        onClose,
        // @ts-expect-error TS2339
        hasPublishedDataset,
        // @ts-expect-error TS2339
        hasLoadedDataset,
        // @ts-expect-error TS2339
        exportFields,
        // @ts-expect-error TS2339
        importFields,
        // @ts-expect-error TS2339
        showModelClearDialog,
        // @ts-expect-error TS2339
        nbFields,
    }) {
        const { translate } = useTranslate();
        const fileInputRef = useRef(null);

        const openModelFileSelector = () => {
            // @ts-expect-error TS2339
            fileInputRef.current?.click();
        };

        // @ts-expect-error TS7006
        const handleModelFileChange = (event) => {
            onClose(() => importFields(event.target.files[0]));
        };

        const handleExportFieldsClick = () => {
            onClose(exportFields);
        };

        const isImportModelDisabled =
            hasPublishedDataset || !hasLoadedDataset || nbFields > 0;

        return (
            <>
                <MenuItem
                    onClick={openModelFileSelector}
                    disabled={isImportModelDisabled}
                >
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>

                    <ListItemText primary={translate('import_fields')} />
                </MenuItem>

                <MenuItem
                    onClick={handleExportFieldsClick}
                    disabled={!hasLoadedDataset}
                >
                    <ListItemIcon>
                        <AspectRatioIcon />
                    </ListItemIcon>
                    <ListItemText primary={translate('export_fields')} />
                </MenuItem>

                <MenuItem
                    onClick={showModelClearDialog}
                    disabled={!hasLoadedDataset}
                >
                    <ListItemIcon>
                        <ClearAllIcon />
                    </ListItemIcon>
                    <ListItemText primary={translate('clear_model')} />
                </MenuItem>

                <input
                    name="file_model"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleModelFileChange}
                    style={{
                        position: 'absolute',
                        left: '-9999px',
                        top: '-9999px',
                    }}
                    disabled={isImportModelDisabled}
                />
            </>
        );
    },
);

// @ts-expect-error TS2339
ModelNestedMenuComponent.propTypes = {
    onClose: PropTypes.func.isRequired,
    hasLoadedDataset: PropTypes.bool.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
    nbFields: PropTypes.number.isRequired,
    importFields: PropTypes.func.isRequired,
    exportFields: PropTypes.func.isRequired,
    showModelClearDialog: PropTypes.func.isRequired,
};

// @ts-expect-error TS7006
const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            exportFields,
            importFields,
        },
        dispatch,
    );

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    nbFields: fromFields.getAllListFields(state).filter((f) => f.name !== 'uri')
        .length,
});

export const ModelNestedMenu = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter,
)(ModelNestedMenuComponent);
