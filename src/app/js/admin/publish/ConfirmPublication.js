import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

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
}) => (
    <Dialog
        open={nbInvalidUri > 0}
        title={polyglot.t('warn_publication')}
        contentStyle={styles.modal}
    >
        <DialogContent>
            <div style={styles.container} id="confirm-publication">
                <p>{polyglot.t('duplicated_uri', { nbInvalidUri })}</p>
            </div>
        </DialogContent>
        <DialogActions>
            <Button
                primary
                key="confirm"
                className="confirm"
                onClick={confirmPublication}
            >
                {polyglot.t('force_publish')}
            </Button>
            <Button
                secondary
                key="cancel"
                className="cancel"
                onClick={cancelPublication}
            >
                {polyglot.t('cancel')}
            </Button>
            ,
        </DialogActions>
    </Dialog>
);

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

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ConfirmPublicationComponent);
