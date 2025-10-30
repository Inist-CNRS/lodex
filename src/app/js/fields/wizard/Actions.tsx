import { Box } from '@mui/material';
import { useParams } from 'react-router';
import { useWatch } from 'react-hook-form';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import isEqual from 'lodash/isEqual';
import RemoveButton from '../../../../../packages/admin-app/src/preview/RemoveButton';
import CancelButton from '@lodex/frontend-common/components/CancelButton.tsx';
import { SaveButton } from '@lodex/frontend-common/components/SaveButton.tsx';
import type { Field } from '../types.ts';

export const ActionsComponent = ({
    currentEditedField,
    onCancel,
    onSave,
}: {
    currentEditedField: Field;
    onCancel: () => void;
    onSave: () => void;
}) => {
    const { translate } = useTranslate();

    // @ts-expect-error TS2339
    const { filter } = useParams();

    const currentFormValues = useWatch();

    if (!currentEditedField) return null;

    const isFormModified = !isEqual(currentEditedField, currentFormValues);

    return (
        <Box display="flex" justifyContent="space-between">
            {currentEditedField.name !== 'uri' && (
                // @ts-expect-error TS2322
                <RemoveButton field={currentEditedField} filter={filter} />
            )}
            <Box display="flex" gap={1}>
                <CancelButton
                    className="btn-exit-column-edition"
                    onClick={onCancel}
                >
                    {translate('cancel')}
                </CancelButton>
                <SaveButton onClick={onSave} isFormModified={isFormModified} />
            </Box>
        </Box>
    );
};

export default ActionsComponent;
