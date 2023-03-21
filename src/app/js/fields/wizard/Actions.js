import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, keyframes, Tooltip } from '@mui/material';
import translate from 'redux-polyglot/translate';
import { useParams } from 'react-router';

import { FIELD_FORM_NAME } from '../';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import RemoveButton from '../../admin/preview/RemoveButton';
import CancelButton from '../../lib/components/CancelButton';
import isEqual from 'lodash.isequal';
import { getFormValues } from 'redux-form';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { SaveAs } from '@mui/icons-material';

const shake = keyframes`
10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(4px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-6px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(6px, 0, 0);
  }
`;

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
                <Button
                    variant="contained"
                    className="btn-save"
                    color="primary"
                    onClick={onSave}
                    startIcon={
                        isFormModified && (
                            <Tooltip title={polyglot.t('form_is_modified')}>
                                <SaveAs />
                            </Tooltip>
                        )
                    }
                    sx={{
                        animation: isFormModified ? `${shake} 1s ease` : '',
                    }}
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
    currentFormValues: PropTypes.object,
};

ActionsComponent.defaultProps = {
    currentEditedField: null,
};

// REDUX PART
const mapStateToProps = state => {
    const currentFormValues = getFormValues(FIELD_FORM_NAME)(state);
    return {
        currentFormValues,
    };
};

export default compose(connect(mapStateToProps), translate)(ActionsComponent);
