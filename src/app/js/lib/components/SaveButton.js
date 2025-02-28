import React from 'react';
import { Button, keyframes, Tooltip } from '@mui/material';
import { useTranslate } from '../../i18n/I18NContext';
import { SaveAs } from '@mui/icons-material';
import PropTypes from 'prop-types';

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

export const SaveButton = ({ onSave, isFormModified }) => {
    const { translate } = useTranslate();

    return (
        <Button
            variant="contained"
            className="btn-save"
            color="primary"
            onClick={onSave}
            startIcon={
                isFormModified && (
                    <Tooltip title={translate('form_is_modified')}>
                        <SaveAs />
                    </Tooltip>
                )
            }
            sx={{
                animation: isFormModified ? `${shake} 1s ease` : '',
            }}
        >
            {translate('save')}
        </Button>
    );
};

SaveButton.propTypes = {
    onSave: PropTypes.func.isRequired,
    isFormModified: PropTypes.bool.isRequired,
};
