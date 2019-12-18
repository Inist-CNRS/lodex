import React from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { fromResource } from '../selectors';
import CreateResourceForm from './CreateResourceForm';
import ButtonWithDialogForm from '../../lib/components/ButtonWithDialogForm';
import {
    createResourceOpen,
    createResourceCancel,
    CREATE_RESOURCE_FORM_NAME,
} from './';
import { fromUser } from '../../sharedSelectors';

const styles = {
    button: {
        position: 'fixed',
        bottom: 100,
        right: 40,
    },
};

const CreateResource = ({ handleOpen, p, ...props }) => (
    <ButtonWithDialogForm
        {...props}
        formName={CREATE_RESOURCE_FORM_NAME}
        form={<CreateResourceForm />}
        label={p.t('create_resource')}
        className="create-resource"
        openButton={
            <Button
                className="create-resource"
                variant="fab"
                onClick={handleOpen}
                style={styles.button}
                title={p.t('create_resource')}
            >
                <FontAwesomeIcon icon={faPlus} />
            </Button>
        }
    />
);

const mapStateToProps = state => ({
    show: fromUser.isAdmin(state),
    open: fromResource.isCreating(state),
    saving: fromResource.isSaving(state),
});

const mapDispatchToProps = {
    handleOpen: createResourceOpen,
    handleClose: createResourceCancel,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(CreateResource);
