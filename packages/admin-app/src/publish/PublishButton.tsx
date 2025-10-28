import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Button, Box } from '@mui/material';

import { publish as publishAction } from './index';
import { fromFields } from '../../../../src/app/js/sharedSelectors';
import { fromPublish } from '../selectors';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';

interface PublishButtonComponentProps {
    canPublish?: boolean;
    onPublish(): void;
    isPublishing?: boolean;
}

export const PublishButtonComponent = ({
    canPublish,
    onPublish,
    isPublishing,
}: PublishButtonComponentProps) => {
    const { translate } = useTranslate();
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
                {translate('publish')}
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
    // @ts-expect-error TS2345
)(PublishButtonComponent);
