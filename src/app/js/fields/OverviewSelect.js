import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { TextField, MenuItem, Box } from '@mui/material';
import * as overview from '../../../common/overview';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';
import { loadField } from './';
import { fromFields } from '../sharedSelectors';
import { SCOPE_DATASET } from '../../../common/scope';
import fieldApi from '../admin/api/field';

export const OverviewSelectComponent = ({ p: polyglot, fields, loadField }) => {
    const [datasetTitle, datasetDescription] = useMemo(() => {
        const datasetTitleField = fields.find(
            field => field.overview === overview.DATASET_TITLE,
        );
        const datasetDescriptionField = fields.find(
            field => field.overview === overview.DATASET_DESCRIPTION,
        );
        return [datasetTitleField?._id, datasetDescriptionField?._id];
    }, [fields]);

    const handleDatasetTitleChange = async event => {
        const { value: _id } = event.target;
        await fieldApi.patchField({
            _id,
            overview: overview.DATASET_TITLE,
        });
        loadField();
    };

    const handleDatasetDescriptionChange = async event => {
        const { value: _id } = event.target;
        await fieldApi.patchField({
            _id,
            overview: overview.DATASET_DESCRIPTION,
        });
        loadField();
    };

    return (
        <Box display="flex" gap={1}>
            <TextField
                select
                value={datasetTitle || ''}
                label={polyglot.t('overviewDatasetTitle')}
                onChange={handleDatasetTitleChange}
                sx={{ minWidth: 220 }}
            >
                {fields.map(field => (
                    <MenuItem key={field._id} value={field._id}>
                        {field.label} ({field.name})
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                value={datasetDescription || ''}
                label={polyglot.t('overviewDatasetDescription')}
                onChange={handleDatasetDescriptionChange}
                sx={{ minWidth: 220 }}
            >
                {fields.map(field => (
                    <MenuItem key={field._id} value={field._id}>
                        {field.label} ({field.name})
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
};

OverviewSelectComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes),
    loadField: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    fields: fromFields.getEditingFields(state, { filter: SCOPE_DATASET }),
});

const mapDispatchToProps = {
    loadField,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(OverviewSelectComponent);
