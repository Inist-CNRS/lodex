import { Box } from '@mui/material';
import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React from 'react';
import { useParams } from 'react-router';
import { translate } from '../../i18n/I18NContext';

import { FIELD_FORM_NAME } from '../';

import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { getFormValues } from 'redux-form';
import RemoveButton from '../../admin/preview/RemoveButton';
import CancelButton from '../../lib/components/CancelButton';
import { SaveButton } from '../../lib/components/SaveButton';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

export const ActionsComponent = ({
    // @ts-expect-error TS7031
    currentEditedField,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    onCancel,
    // @ts-expect-error TS7031
    onSave,
    // @ts-expect-error TS7031
    currentFormValues,
}) => {
    // @ts-expect-error TS2339
    const { filter } = useParams();
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
// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    const currentFormValues = getFormValues(FIELD_FORM_NAME)(state);
    return {
        currentFormValues,
    };
};

// @ts-expect-error TS2345
export default compose(connect(mapStateToProps), translate)(ActionsComponent);
