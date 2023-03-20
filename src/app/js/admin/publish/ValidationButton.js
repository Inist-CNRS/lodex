import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { List, Popover, IconButton, Tooltip, Box } from '@mui/material';

import { fromFields } from '../../sharedSelectors';
import ValidationField from './ValidationField';

import {
    validationField as validationFieldPropType,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { SCOPE_DOCUMENT } from '../../../../common/scope';
import translate from 'redux-polyglot/translate';
import { useHistory } from 'react-router-dom';
import { getEditFieldRedirectUrl } from '../../fields/FieldGrid';
import WarningIcon from '@mui/icons-material/Warning';

const anchorOrigin = { horizontal: 'right', vertical: 'top' };
const targetOrigin = { horizontal: 'right', vertical: 'bottom' };

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '1rem',
    },
};

const ValidationButtonComponent = ({
    handleEditField,
    fields,
    handleHideErrors,
    handleShowErrorsClick,
    popover,
    p: polyglot,
}) => {
    const history = useHistory();
    // @TODO: Find a better way to handle fix error from data tab
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
            <Tooltip title={polyglot.t(`show_publication_errors`)}>
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
                anchorOrigin={anchorOrigin}
                targetOrigin={targetOrigin}
                onClose={handleHideErrors}
            >
                <List className="validation">
                    {fields.map(field => (
                        <ValidationField
                            key={field.name}
                            field={field}
                            onEditField={redirectAndHandleEditField}
                        />
                    ))}
                </List>
            </Popover>
        </Box>
    );
};

ValidationButtonComponent.propTypes = {
    popover: PropTypes.object,
    handleEditField: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(validationFieldPropType).isRequired,
    handleHideErrors: PropTypes.func.isRequired,
    handleShowErrorsClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};
ValidationButtonComponent.defaultProps = {
    popover: { show: false },
};

const mapStateToProps = state => ({
    fields: fromFields.getInvalidFields(state),
});

export default compose(
    connect(mapStateToProps),
    withState('popover', 'setShowPopover', { show: false }),
    withHandlers({
        handleShowErrorsClick: ({ setShowPopover }) => event => {
            event.preventDefault();
            setShowPopover({ anchorEl: event.currentTarget, show: true });
        },
        handleHideErrors: ({ setShowPopover }) => () => {
            setShowPopover({ show: false });
        },
        handleEditField: ({ setShowPopover }) => () => {
            setShowPopover({ show: false });
        },
    }),
    translate,
)(ValidationButtonComponent);
