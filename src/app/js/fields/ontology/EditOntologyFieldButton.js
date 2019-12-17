import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
<<<<<<< HEAD
import SettingsIcon from '@material-ui/icons/Settings';
=======
import SettingsIcon from '@material-ui/icons/settings';
import { grey } from '@material-ui/core/colors';
>>>>>>> 55d1bdf5... Change all colors

import getFieldClassName from '../../lib/getFieldClassName';
import EditOntologyFieldForm, { FORM_NAME } from './EditOntologyFieldForm';
import { fromUser, fromFields } from '../../sharedSelectors';
import ButtonWithDialogForm from '../../lib/components/ButtonWithDialogForm';
import { configureFieldOpen, configureFieldCancel } from '../';

const styles = {
    label: {
        float: 'right',
        color: grey[400],
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
    icon: <SettingsIcon />,
});

const mapDispatchToProps = (dispatch, { field: { name } }) => ({
    handleOpen: () => dispatch(configureFieldOpen(name)),
    handleClose: () => dispatch(configureFieldCancel()),
});

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ButtonWithDialogForm);
