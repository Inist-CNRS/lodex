import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import translate from 'redux-polyglot/translate';
import { useParams } from 'react-router';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import RemoveButton from '../../admin/preview/RemoveButton';
import CancelButton from '../../lib/components/CancelButton';

export const ActionsComponent = ({
    currentEditedField,
    p: polyglot,
    onCancel,
    onSave,
}) => {
    const { filter } = useParams();
    if (!currentEditedField) return null;

    return (
        <Box display="flex" justifyContent="space-between" mb={2}>
            {currentEditedField.name !== 'uri' && (
                <RemoveButton field={currentEditedField} filter={filter} />
            )}
            <Box display="flex" gap={1}>
                <CancelButton
                    className="btn-exit-column-edition"
                    onClick={onCancel}
                >
                    {polyglot.t('cancel')}
                </CancelButton>
                <Button
                    variant="contained"
                    className="btn-save"
                    color="primary"
                    onClick={onSave}
                >
                    {polyglot.t('save')}
                </Button>
            </Box>
        </Box>
    );
};

ActionsComponent.propTypes = {
    currentEditedField: fieldPropTypes,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

ActionsComponent.defaultProps = {
    currentEditedField: null,
};

export default translate(ActionsComponent);
