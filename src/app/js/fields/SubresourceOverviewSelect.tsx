import { useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { TextField, MenuItem } from '@mui/material';
import { Overview } from '@lodex/common';
import { loadField } from '@lodex/frontend-common/fields/reducer';
import { fromFields } from '@lodex/frontend-common/sharedSelectors';
import fieldApi from '../../../../packages/admin-app/src/api/field';
import FieldRepresentation from './FieldRepresentation';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { Field } from './types';

interface SubresourceOverviewSelectComponentProps {
    fields?: Field[];
    loadField(): void;
    subresourceId: string;
}

export const SubresourceOverviewSelectComponent = ({
    fields,
    loadField,
    subresourceId,
}: SubresourceOverviewSelectComponentProps) => {
    const { translate } = useTranslate();
    const subresourceTitle = useMemo(() => {
        // @ts-expect-error TS18048
        const subresourceTitleField = fields.find(
            (field) => field.overview === Overview.SUBRESOURCE_TITLE,
        );
        return subresourceTitleField?._id;
    }, [fields]);

    // @ts-expect-error TS7006
    const handleSubresourceTitleChange = async (event) => {
        const { value: _id } = event.target;
        await fieldApi.patchOverview({
            _id,
            overview: Overview.SUBRESOURCE_TITLE,
            subresourceId,
        });
        loadField();
    };

    return (
        <TextField
            select
            value={subresourceTitle || ''}
            label={translate('overviewSubresourceTitle')}
            onChange={handleSubresourceTitleChange}
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
                    key={field._id}
                    value={field._id}
                >
                    <FieldRepresentation field={field} />
                </MenuItem>
            ))}
        </TextField>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { subresourceId }) => ({
    fields: fromFields.getEditingFields(state, { subresourceId }),
});

const mapDispatchToProps = {
    loadField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(SubresourceOverviewSelectComponent);
