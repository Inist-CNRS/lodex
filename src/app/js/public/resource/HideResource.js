import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { fromResource } from '../selectors';
import {
    hideResourceOpen,
    hideResourceCancel,
    HIDE_RESOURCE_FORM_NAME,
} from './';
import HideResourceForm from './HideResourceForm';
import { fromUser } from '../../sharedSelectors';
import ButtonWithDialogForm from '../../lib/components/ButtonWithDialogForm';

const mapStateToProps = (state, { p }) => ({
    open: fromResource.isHiding(state),
    saving: fromResource.isSaving(state),
    show: fromUser.isAdmin(state),
    formName: HIDE_RESOURCE_FORM_NAME,
    form: <HideResourceForm />,
    label: p.t('hide'),
    className: 'hide-resource',
});

const mapDispatchToProps = {
    handleOpen: () => hideResourceOpen(),
    handleClose: () => hideResourceCancel(),
};

export default compose(
    translate,
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
)(ButtonWithDialogForm);
