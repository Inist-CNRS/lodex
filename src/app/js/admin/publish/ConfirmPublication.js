import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import Dialog from '@material-ui/core/Dialog';
import FlatButton from '@material-ui/core/FlatButton';

import { publishConfirm, publishCancel } from './';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromPublish } from '../selectors';

const styles = {
    container: {
        display: 'flex',
        paddingBottom: '1rem',
    },
    modal: {
        maxWidth: '100%',
    },
};

export const ConfirmPublicationComponent = ({
    nbInvalidUri,
    confirmPublication,
    cancelPublication,
    p: polyglot,
}) => {
    const actions = [
        <FlatButton
            primary
            key="confirm"
            className="confirm"
            label={polyglot.t('force_publish')}
            onClick={confirmPublication}
        />,
        <FlatButton
            secondary
            key="cancel"
            className="cancel"
            label={polyglot.t('cancel')}
            onClick={cancelPublication}
        />,
    ];
    return (
        <Dialog
            open={nbInvalidUri > 0}
            actions={actions}
            title={polyglot.t('warn_publication')}
            contentStyle={styles.modal}
        >
            <div style={styles.container} id="confirm-publication">
                <p>{polyglot.t('duplicated_uri', { nbInvalidUri })}</p>
            </div>
        </Dialog>
    );
};

ConfirmPublicationComponent.propTypes = {
    nbInvalidUri: PropTypes.number.isRequired,
    confirmPublication: PropTypes.func.isRequired,
    cancelPublication: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    nbInvalidUri: fromPublish.getNbInvalidUri(state),
});

const mapDispatchToProps = {
    confirmPublication: publishConfirm,
    cancelPublication: publishCancel,
};

export default compose(translate, connect(mapStateToProps, mapDispatchToProps))(
    ConfirmPublicationComponent,
);
