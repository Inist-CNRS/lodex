import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';

import ClearDialog from '../Appbar/ClearDialog';
import { fromParsing } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const ClearDatasetButtonComponent = ({ p: polyglot, hasLoadedDataset }) => {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleHide = () => setShow(false);

    return (
        <>
            <Button
                disabled={!hasLoadedDataset}
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleShow}
            >
                {polyglot.t('clear_dataset')}
            </Button>
            {show && <ClearDialog type="dataset" onClose={handleHide} />}
        </>
    );
};

ClearDatasetButtonComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    hasLoadedDataset: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
});

export const ClearDatasetButton = compose(
    translate,
    connect(mapStateToProps),
)(ClearDatasetButtonComponent);
