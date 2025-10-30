import { useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { TextField, MenuItem } from '@mui/material';
import * as overview from '../../../common/overview';
import { loadField } from '.';
import { fromFields } from '../sharedSelectors';
import fieldApi from '../admin/api/field';
import FieldRepresentation from './FieldRepresentation';
import { useTranslate } from '../i18n/I18NContext';
import type { Field } from '../propTypes';

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
            // @ts-expect-error TS7006
            (field) => field.overview === overview.SUBRESOURCE_TITLE,
        );
        // @ts-expect-error TS2339
        return subresourceTitleField?._id;
    }, [fields]);

    // @ts-expect-error TS7006
    const handleSubresourceTitleChange = async (event) => {
        const { value: _id } = event.target;
        await fieldApi.patchOverview({
            _id,
            overview: overview.SUBRESOURCE_TITLE,
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
                    // @ts-expect-error TS18046
                    key={field._id}
                    // @ts-expect-error TS18046
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
