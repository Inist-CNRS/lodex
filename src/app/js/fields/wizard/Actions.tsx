import { Box } from '@mui/material';
import { useParams } from 'react-router';
import { useWatch } from 'react-hook-form';
import { useTranslate } from '../../i18n/I18NContext';
import isEqual from 'lodash/isEqual';
import RemoveButton from '../../admin/preview/RemoveButton';
import CancelButton from '../../lib/components/CancelButton';
import { SaveButton } from '../../lib/components/SaveButton';
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

ActionsComponent.defaultProps = {
    currentEditedField: null,
};

export default ActionsComponent;
