import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import getFieldClassName from '../../lib/getFieldClassName';
import EditOntologyFieldForm, { FORM_NAME } from './EditOntologyFieldForm';
import { fromUser, fromFields } from '../../sharedSelectors';
import ButtonWithDialogForm from '../../lib/components/ButtonWithDialogForm';
import { configureFieldOpen, configureFieldCancel } from '../';
import { grey400 } from 'material-ui/styles/colors';

const styles = {
    label: {
        float: 'right',
        color: grey400,
        fontSize: '1rem',
    },
};

const mapStateToProps = (state, { field, p }) => ({
    open: fromFields.isFieldConfigured(state, field.name),
    show: fromUser.isAdmin(state),
    saving: fromFields.isSaving(state),
    className: classnames('configure-field', getFieldClassName(field)),
    label: (
        <p>
            {p.t('configure_field', { field: field.label })}{' '}
            <span style={styles.label}>#{field.name}</span>
        </p>
    ),
    form: <EditOntologyFieldForm field={field} />,
    formName: FORM_NAME,
    icon: <FontAwesomeIcon icon={faCog} />,
});

const mapDispatchToProps = (dispatch, { field: { name } }) => ({
    handleOpen: () => dispatch(configureFieldOpen(name)),
    handleClose: () => dispatch(configureFieldCancel()),
});

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ButtonWithDialogForm);
