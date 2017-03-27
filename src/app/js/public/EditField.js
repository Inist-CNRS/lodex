import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

import EditFieldForm, { FORM_NAME } from './EditFieldForm';
import { fromResource } from './selectors';
import { isLoggedIn } from '../user';
import getFieldClassName from '../lib/getFieldClassName';
import DialogButton from '../lib/DialogButton';

const mapStateToProps = (state, { field, resource, onSaveProperty, style, p }) => ({
    show: isLoggedIn(state) && fromResource.isLastVersionSelected(state),
    form: <EditFieldForm
        field={field}
        onSaveProperty={onSaveProperty}
        resource={resource}
    />,
    formName: FORM_NAME,
    className: classnames('edit-field', getFieldClassName(field)),
    label: p.t('edit_field', { field: field.label }),
    icon: <EditIcon />,
    style,
});

export default compose(
    translate,
    connect(mapStateToProps),
)(DialogButton);
