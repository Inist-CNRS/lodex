import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Button, Box } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { publish as publishAction } from './';
import { fromFields } from '../../sharedSelectors';
import { fromPublish } from '../selectors';

export const PublishButtonComponent = ({
    canPublish,
    p: polyglot,
    onPublish,
    isPublishing,
}) => {
    const handleClick = () => {
        onPublish();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}
            className="btn-publish"
        >
            <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
                disabled={!canPublish || isPublishing}
                sx={{
                    marginLeft: 4,
                    marginRight: 4,
                    height: 40,
                }}
            >
                {polyglot.t('publish')}
            </Button>
        </Box>
    );
};

PublishButtonComponent.propTypes = {
    canPublish: PropTypes.bool.isRequired,
    onPublish: PropTypes.func.isRequired,
    isPublishing: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

export const canPublish = (areAllFieldsValid, allListFields) => {
    return areAllFieldsValid && allListFields.some((f) => f.name !== 'uri');
};

const mapStateToProps = (state) => ({
    canPublish: canPublish(
        fromFields.areAllFieldsValid(state),
        fromFields.getAllListFields(state),
    ),
    isPublishing: fromPublish.getIsPublishing(state),
});

const mapDispatchToProps = {
    onPublish: publishAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublishButtonComponent);
