import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import translate from 'redux-polyglot/translate';
import { List, Popover, Button } from '@material-ui/core';

import { fromFields } from '../../sharedSelectors';
import ValidationField from './ValidationField';
import { editField as editFieldAction } from '../../fields';

import {
    polyglot as polyglotPropTypes,
    validationField as validationFieldPropType,
} from '../../propTypes';

const anchorOrigin = { horizontal: 'right', vertical: 'top' };
const targetOrigin = { horizontal: 'right', vertical: 'bottom' };
const styles = {
    container: {
        display: 'inline-block',
        marginLeft: 4,
        marginRight: 4,
    },
};

const ValidationButtonComponent = ({
    handleEditField,
    fields,
    handleHideErrors,
    handleShowErrorsClick,
    p: polyglot,
    popover,
}) => (
    <div style={styles.container}>
        <Button
            color="secondary"
            variant="contained"
            onClick={handleShowErrorsClick}
        >
            {polyglot.t('show_publication_errors')}
        </Button>
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
                        onEditField={handleEditField}
                    />
                ))}
            </List>
        </Popover>
    </div>
);

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
        handleEditField: ({ editField, setShowPopover }) => field => {
            setShowPopover({ show: false });
            editField(field);
        },
    }),
    translate,
)(ValidationButtonComponent);
