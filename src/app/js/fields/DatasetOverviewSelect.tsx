// @ts-expect-error TS6133
import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
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
import FieldRepresentation from './FieldRepresentation';
import { translate } from '../i18n/I18NContext';

interface DatasetOverviewSelectComponentProps {
    p: unknown;
    fields?: unknown[];
    loadField(...args: unknown[]): unknown;
}

export const DatasetOverviewSelectComponent = ({
    p: polyglot,

    fields,

    loadField
}: DatasetOverviewSelectComponentProps) => {
    const [datasetTitle, datasetDescription] = useMemo(() => {
        const datasetTitleField = fields.find(
            // @ts-expect-error TS7006
            (field) => field.overview === overview.DATASET_TITLE,
        );
        const datasetDescriptionField = fields.find(
            // @ts-expect-error TS7006
            (field) => field.overview === overview.DATASET_DESCRIPTION,
        );
        return [datasetTitleField?._id, datasetDescriptionField?._id];
    }, [fields]);

    // @ts-expect-error TS7006
    const handleDatasetTitleChange = async (event) => {
        const { value: _id } = event.target;
        await fieldApi.patchOverview({
            _id,
            overview: overview.DATASET_TITLE,
        });
        loadField();
    };

    // @ts-expect-error TS7006
    const handleDatasetDescriptionChange = async (event) => {
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
                SelectProps={{
                    renderValue: (option) => (
                        <FieldRepresentation
                            // @ts-expect-error TS7006
                            field={fields.find((f) => f._id === option)}
                            shortMode
                        />
                    ),
                }}
            >
                <MenuItem value={undefined}>{polyglot.t('none')}</MenuItem>
                {/*
                 // @ts-expect-error TS7006 */}
                {fields.map((field) => (
                    <MenuItem
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                        value={field._id}
                        key={field._id}
                    >
                        <FieldRepresentation field={field} />
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                value={datasetDescription || ''}
                label={polyglot.t('overviewDatasetDescription')}
                onChange={handleDatasetDescriptionChange}
                sx={{ minWidth: 220 }}
                SelectProps={{
                    renderValue: (option) => (
                        <FieldRepresentation
                            // @ts-expect-error TS7006
                            field={fields.find((f) => f._id === option)}
                            shortMode
                        />
                    ),
                }}
            >
                <MenuItem value={undefined}>{polyglot.t('none')}</MenuItem>
                {/*
                 // @ts-expect-error TS7006 */}
                {fields.map((field) => (
                    <MenuItem
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                        value={field._id}
                        key={field._id}
                    >
                        <FieldRepresentation field={field} />
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
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
    // @ts-expect-error TS2345
)(DatasetOverviewSelectComponent);
