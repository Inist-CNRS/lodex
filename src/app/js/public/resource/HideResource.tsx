import React from 'react';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';

import { fromResource } from '../selectors';
import {
    hideResourceOpen,
    hideResourceCancel,
    HIDE_RESOURCE_FORM_NAME,
} from './';
import HideResourceForm from './HideResourceForm';
import { fromUser } from '../../sharedSelectors';
import ButtonWithDialogForm from '../../lib/components/ButtonWithDialogForm';

// @ts-expect-error TS7006
const mapStateToProps = (state, { p }) => ({
    // @ts-expect-error TS2339
    open: fromResource.isHiding(state),
    // @ts-expect-error TS2339
    saving: fromResource.isSaving(state),
    // @ts-expect-error TS2339
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
    connect(mapStateToProps, mapDispatchToProps),
)(ButtonWithDialogForm);
