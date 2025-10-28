import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { List, Popover, IconButton, Tooltip, Box } from '@mui/material';

import { fromFields } from '../../../../src/app/js/sharedSelectors';
import ValidationField from './ValidationField';

import { SCOPE_DOCUMENT } from '@lodex/common';
import { useHistory } from 'react-router-dom';
import { getEditFieldRedirectUrl } from '../../../../src/app/js/fields/FieldGrid';
import WarningIcon from '@mui/icons-material/Warning';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';

const anchorOrigin = { horizontal: 'right', vertical: 'top' };
const targetOrigin = { horizontal: 'right', vertical: 'bottom' };

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '1rem',
    },
};

interface ValidationButtonComponentProps {
    popover: {
        show: boolean;
        anchorEl?: HTMLElement;
    };
    handleEditField(...args: unknown[]): unknown;
    fields: {
        name: string;
        scope: string;
        subresourceId?: string;
    }[];
    handleHideErrors(...args: unknown[]): unknown;
    handleShowErrorsClick(...args: unknown[]): unknown;
}

const ValidationButtonComponent = ({
    handleEditField,
    fields,
    handleHideErrors,
    handleShowErrorsClick,
    popover = { show: false },
}: ValidationButtonComponentProps) => {
    const { translate } = useTranslate();
    const history = useHistory();
    // @TODO: Find a better way to handle fix error from data tab
    // @ts-expect-error TS7019
    const redirectAndHandleEditField = (...args) => {
        const field = fields.find(({ name }) => name === args[0]);
        handleEditField();
        const redirectUrl = getEditFieldRedirectUrl(
            field?.name,
            field?.scope || SCOPE_DOCUMENT,
            field?.subresourceId,
        );
        history.push(redirectUrl);
    };

    return (
        <Box sx={styles.container}>
            <Tooltip title={translate(`show_publication_errors`)}>
                {/*
                 // @ts-expect-error TS2769 */}
                <IconButton
                    color="warning"
                    variant="contained"
                    onClick={handleShowErrorsClick}
                    className={'validation-button'}
                    sx={{
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: '10px',
                            height: '10px',
                            // @ts-expect-error TS2339
                            background: ({ palette }) => palette.contrast.main,
                            zIndex: -1,
                            marginTop: '5px',
                        },
                    }}
                >
                    {/* Set a warningIcon with an after block white */}
                    <WarningIcon
                        sx={{
                            fontSize: '30px',
                        }}
                    />
                </IconButton>
            </Tooltip>
            <Popover
                open={popover.show}
                anchorEl={popover.anchorEl}
                // @ts-expect-error TS2322
                anchorOrigin={anchorOrigin}
                targetOrigin={targetOrigin}
                onClose={handleHideErrors}
            >
                <List className="validation">
                    {fields.map((field) => (
                        <ValidationField
                            key={field.name}
                            // @ts-expect-error TS2322
                            field={field}
                            onEditField={redirectAndHandleEditField}
                        />
                    ))}
                </List>
            </Popover>
        </Box>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    fields: fromFields.getInvalidFields(state),
});

export default compose(
    connect(mapStateToProps),
    withState('popover', 'setShowPopover', { show: false }),
    withHandlers({
        // @ts-expect-error TS2322
        handleShowErrorsClick:
            ({ setShowPopover }) =>
            // @ts-expect-error TS7006
            (event) => {
                event.preventDefault();
                setShowPopover({
                    anchorEl: event.currentTarget,
                    show: true,
                });
            },
        // @ts-expect-error TS2322
        handleHideErrors:
            ({ setShowPopover }) =>
            () => {
                setShowPopover({ show: false });
            },
        // @ts-expect-error TS2322
        handleEditField:
            ({ setShowPopover }) =>
            () => {
                setShowPopover({ show: false });
            },
    }),
    // @ts-expect-error TS2345
)(ValidationButtonComponent);
