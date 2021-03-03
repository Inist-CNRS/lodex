import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import {
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';

import { publishConfirm, publishCancel } from './';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromPublish } from '../selectors';

const styles = {
    container: {
        paddingBottom: '1rem',
    },
};

export const ConfirmPublicationComponent = ({
    nbInvalidUri,
    nbInvalidSubresourceUriMap,
    confirmPublication,
    cancelPublication,
    p: polyglot,
}) => {
    const actions = [
        <Button
            variant="text"
            color="primary"
            key="confirm"
            className="confirm"
            onClick={confirmPublication}
        >
            {polyglot.t('force_publish')}
        </Button>,
        <Button
            variant="text"
            color="secondary"
            key="cancel"
            className="cancel"
            onClick={cancelPublication}
        >
            {polyglot.t('cancel')}
        </Button>,
    ];

    const nbInvalidSubresources = Object.keys(nbInvalidSubresourceUriMap)
        .length;

    return (
        <Dialog open={nbInvalidUri > 0 || nbInvalidSubresources > 0}>
            <DialogTitle>{polyglot.t('warn_publication')}</DialogTitle>
            <DialogContent>
                <div style={styles.container} id="confirm-publication">
                    <p>{polyglot.t('duplicated_uri', { nbInvalidUri })}</p>
                    {nbInvalidSubresources > 0 && (
                        <div>
                            <p>
                                {polyglot.t('duplicated_subresource', {
                                    nbInvalidSubresources,
                                })}
                            </p>
                            <ul>
                                {Object.keys(nbInvalidSubresourceUriMap).map(
                                    name => (
                                        <li key={name}>
                                            {name}:{' '}
                                            {nbInvalidSubresourceUriMap[name]}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

ConfirmPublicationComponent.propTypes = {
    nbInvalidUri: PropTypes.number.isRequired,
    nbInvalidSubresourceUriMap: PropTypes.object.isRequired,
    confirmPublication: PropTypes.func.isRequired,
    cancelPublication: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    nbInvalidUri: fromPublish.getNbInvalidUri(state),
    nbInvalidSubresourceUriMap: fromPublish.getNbInvalidSubresourceUriMap(
        state,
    ),
});

const mapDispatchToProps = {
    confirmPublication: publishConfirm,
    cancelPublication: publishCancel,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(ConfirmPublicationComponent);
