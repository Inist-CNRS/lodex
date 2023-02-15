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
import { loadField } from '.';
import { fromFields } from '../sharedSelectors';
import { SCOPE_DATASET } from '../../../common/scope';
import fieldApi from '../admin/api/field';
import FieldInternalIcon from './FieldInternalIcon';

export const DatasetOverviewSelectComponent = ({
    p: polyglot,
    fields,
    loadField,
}) => {
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
        await fieldApi.patchOverview({
            _id,
            overview: overview.DATASET_TITLE,
        });
        loadField();
    };

    const handleDatasetDescriptionChange = async event => {
        const { value: _id } = event.target;
        await fieldApi.patchOverview({
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
                <MenuItem value={undefined}>{polyglot.t('none')}</MenuItem>
                {fields.map(
                    field =>
                        !!field.label && (
                            <MenuItem
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                                value={field._id}
                                key={field._id}
                            >
                                <Box>
                                    {field.label}{' '}
                                    {field.name ? `(${field.name})` : ''}
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {field.internalScopes &&
                                        field.internalScopes.map(
                                            internalScope => (
                                                <FieldInternalIcon
                                                    key={internalScope}
                                                    scope={internalScope}
                                                />
                                            ),
                                        )}
                                    {field.internalName}
                                </Box>
                            </MenuItem>
                        ),
                )}
            </TextField>
            <TextField
                select
                value={datasetDescription || ''}
                label={polyglot.t('overviewDatasetDescription')}
                onChange={handleDatasetDescriptionChange}
                sx={{ minWidth: 220 }}
            >
                <MenuItem value={undefined}>{polyglot.t('none')}</MenuItem>
                {fields.map(
                    field =>
                        !!field.label && (
                            <MenuItem
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                                value={field._id}
                                key={field._id}
                            >
                                <Box>
                                    {field.label}{' '}
                                    {field.name ? `(${field.name})` : ''}
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {field.internalScopes &&
                                        field.internalScopes.map(
                                            internalScope => (
                                                <FieldInternalIcon
                                                    key={internalScope}
                                                    scope={internalScope}
                                                />
                                            ),
                                        )}
                                    {field.internalName}
                                </Box>
                            </MenuItem>
                        ),
                )}
            </TextField>
        </Box>
    );
};

DatasetOverviewSelectComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes),
    loadField: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    fields: fromFields
        .getEditingFields(state, { filter: SCOPE_DATASET })
        .sort((a, b) => a.label.localeCompare(b.label)),
});

const mapDispatchToProps = {
    loadField,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(DatasetOverviewSelectComponent);
