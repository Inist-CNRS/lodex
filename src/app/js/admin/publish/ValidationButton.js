import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { List, Popover, IconButton } from '@material-ui/core';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import { fromFields } from '../../sharedSelectors';
import ValidationField from './ValidationField';
import { editField as editFieldAction } from '../../fields';

import { validationField as validationFieldPropType } from '../../propTypes';
import { SCOPE_DOCUMENT } from '../../../../common/scope';

const anchorOrigin = { horizontal: 'right', vertical: 'top' };
const targetOrigin = { horizontal: 'right', vertical: 'bottom' };
const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 10,
    },
};

const ValidationButtonComponent = ({
    handleEditField,
    fields,
    handleHideErrors,
    handleShowErrorsClick,
    popover,
}) => {
    // @TODO: Find a better way to handle fix error from data tab
    const redirectAndHandleEditField = (...args) => {
        const field = fields.find(({ name }) => name === args[0]);

        setTimeout(
            () => handleEditField(field?.name, field?.scope || SCOPE_DOCUMENT),
            1000,
        );
    };

    return (
        <div style={styles.container}>
            <IconButton
                color="secondary"
                variant="contained"
                onClick={handleShowErrorsClick}
                className={'validation-button'}
            >
                <ReportProblemIcon />
            </IconButton>
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
        </div>
    );
};

ValidationButtonComponent.propTypes = {
    popover: PropTypes.object,
    handleEditField: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(validationFieldPropType).isRequired,
    handleHideErrors: PropTypes.func.isRequired,
    handleShowErrorsClick: PropTypes.func.isRequired,
};
ValidationButtonComponent.defaultProps = {
    popover: { show: false },
};

const mapStateToProps = state => ({
    fields: fromFields.getInvalidFields(state),
});

const mapDispatchToProps = { editField: editFieldAction };

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withState('popover', 'setShowPopover', { show: false }),
    withHandlers({
        handleShowErrorsClick: ({ setShowPopover }) => event => {
            event.preventDefault();
            setShowPopover({ anchorEl: event.currentTarget, show: true });
        },
        handleHideErrors: ({ setShowPopover }) => () => {
            setShowPopover({ show: false });
        },
        handleEditField: ({ editField, setShowPopover }) => (field, filter) => {
            setShowPopover({ show: false });
            editField({ field, filter });
        },
    }),
)(ValidationButtonComponent);
