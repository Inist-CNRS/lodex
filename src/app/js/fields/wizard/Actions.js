import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { translate } from '../../i18n/I18NContext';
import { useParams } from 'react-router';

import { FIELD_FORM_NAME } from '../';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import RemoveButton from '../../admin/preview/RemoveButton';
import CancelButton from '../../lib/components/CancelButton';
import isEqual from 'lodash/isEqual';
import { getFormValues } from 'redux-form';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { SaveButton } from '../../lib/components/SaveButton';

export const ActionsComponent = ({
    currentEditedField,
    p: polyglot,
    onCancel,
    onSave,
    currentFormValues,
}) => {
    const { filter } = useParams();
    if (!currentEditedField) return null;

    const isFormModified = !isEqual(currentEditedField, currentFormValues);

    return (
        <Box display="flex" justifyContent="space-between">
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
                <SaveButton onClick={onSave} isFormModified={isFormModified} />
            </Box>
        </Box>
    );
};

ActionsComponent.propTypes = {
    currentEditedField: fieldPropTypes,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    currentFormValues: PropTypes.object,
};

ActionsComponent.defaultProps = {
    currentEditedField: null,
};

// REDUX PART
const mapStateToProps = (state) => {
    const currentFormValues = getFormValues(FIELD_FORM_NAME)(state);
    return {
        currentFormValues,
    };
};

export default compose(connect(mapStateToProps), translate)(ActionsComponent);
