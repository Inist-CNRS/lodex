import React, { useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import classnames from 'classnames';

import ClearDialog from '../Appbar/ClearDialog';
import { fromPublication } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const useStyles = makeStyles({
    button: {
        color: 'white',
        padding: '0 20px',
        height: 40,
    },
    container: {
        display: 'flex',
        alignItems: 'center',
    },
});

const ClearPublishedButtonComponent = ({
    p: polyglot,
    hasPublishedDataset,
}) => {
    const classes = useStyles();
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleHide = () => setShow(false);

    return (
        <div className={classnames('btn-unpublish', classes.container)}>
            <Button
                raised
                disabled={!hasPublishedDataset}
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={handleShow}
                icon={<ClearAllIcon />}
            >
                {polyglot.t('clear_publish')}
            </Button>
            {show && <ClearDialog type="published" onClose={handleHide} />}
        </div>
    );
};

ClearPublishedButtonComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

export const ClearPublishedButton = compose(
    translate,
    connect(mapStateToProps),
)(ClearPublishedButtonComponent);
