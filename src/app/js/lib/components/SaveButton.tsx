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

// @ts-expect-error TS7031
export const SaveButton = ({ onClick, type, isFormModified, disabled }) => {
    const { translate } = useTranslate();

    return (
        <Button
            variant="contained"
            className="btn-save"
            color="primary"
            onClick={onClick}
            type={type}
            disabled={disabled}
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
    onClick: PropTypes.func,
    type: PropTypes.string,
    isFormModified: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
};
