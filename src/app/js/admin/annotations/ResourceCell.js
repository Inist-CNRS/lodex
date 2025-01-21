import PropTypes from 'prop-types';
import React from 'react';
import { useTranslate } from '../../i18n/I18NContext';
import { Tooltip, Typography } from '@mui/material';

export const ResourceCell = ({ resource }) => {
    const { translate } = useTranslate();
    if (!resource) {
        return <>{translate('annotation.resource_not_found')}</>;
    }
    return (
        <Tooltip title={resource.title}>
            <Typography
                sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                }}
            >
                {resource.title}
            </Typography>
        </Tooltip>
    );
};

ResourceCell.propTypes = {
    resource: PropTypes.shape({
        title: PropTypes.string.isRequired,
        uri: PropTypes.string.isRequired,
    }),
};
