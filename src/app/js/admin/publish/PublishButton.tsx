// @ts-expect-error TS6133
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Button, Box } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { publish as publishAction } from './';
import { fromFields } from '../../sharedSelectors';
import { fromPublish } from '../selectors';
import { translate } from '../../i18n/I18NContext';

interface PublishButtonComponentProps {
    canPublish: boolean;
    onPublish(...args: unknown[]): unknown;
    isPublishing?: boolean;
    p: unknown;
}

export const PublishButtonComponent = ({
    canPublish,

    p: polyglot,

    onPublish,

    isPublishing
}: PublishButtonComponentProps) => {
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

// @ts-expect-error TS7006
export const canPublish = (areAllFieldsValid, allListFields) => {
    // @ts-expect-error TS7006
    return areAllFieldsValid && allListFields.some((f) => f.name !== 'uri');
};

// @ts-expect-error TS7006
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
    // @ts-expect-error TS2345
)(PublishButtonComponent);
