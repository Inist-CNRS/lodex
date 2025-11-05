import { useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { TextField, MenuItem, Box } from '@mui/material';
import { Overview, SCOPE_DATASET } from '@lodex/common';
import { loadField } from '@lodex/frontend-common/fields/reducer';
import { fromFields } from '@lodex/frontend-common/sharedSelectors';
import fieldApi from '../api/field';
import FieldRepresentation from './FieldRepresentation';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { Field } from '@lodex/frontend-common/fields/types';

interface DatasetOverviewSelectComponentProps {
    fields?: Field[];
    loadField(...args: unknown[]): unknown;
}

export const DatasetOverviewSelectComponent = ({
    fields,
    loadField,
}: DatasetOverviewSelectComponentProps) => {
    const { translate } = useTranslate();
    const [datasetTitle, datasetDescription] = useMemo(() => {
        // @ts-expect-error TS18048
        const datasetTitleField = fields.find(
            (field) => field.overview === Overview.DATASET_TITLE,
        );
        // @ts-expect-error TS18048
        const datasetDescriptionField = fields.find(
            (field) => field.overview === Overview.DATASET_DESCRIPTION,
        );
        return [datasetTitleField?._id, datasetDescriptionField?._id];
    }, [fields]);

    // @ts-expect-error TS7006
    const handleDatasetTitleChange = async (event) => {
        const { value: _id } = event.target;
        await fieldApi.patchOverview({
            _id,
            overview: Overview.DATASET_TITLE,
        });
        loadField();
    };

    // @ts-expect-error TS7006
    const handleDatasetDescriptionChange = async (event) => {
        const { value: _id } = event.target;
        await fieldApi.patchOverview({
            _id,
            overview: Overview.DATASET_DESCRIPTION,
        });
        loadField();
    };

    return (
        <Box display="flex" gap={1}>
            <TextField
                select
                value={datasetTitle || ''}
                label={translate('overviewDatasetTitle')}
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
                <MenuItem value={undefined}>{translate('none')}</MenuItem>
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
                label={translate('overviewDatasetDescription')}
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
                <MenuItem value={undefined}>{translate('none')}</MenuItem>
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
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(DatasetOverviewSelectComponent);
