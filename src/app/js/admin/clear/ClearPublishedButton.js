import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import ClearDialog from '../Appbar/ClearDialog';
import { fromPublication } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const ClearPublishedButtonComponent = ({
    p: polyglot,
    hasPublishedDataset,
}) => {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleHide = () => setShow(false);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}
            className="btn-unpublish"
        >
            <Button
                disabled={!hasPublishedDataset}
                variant="contained"
                role="button"
                aria-label="unpublish"
                sx={{
                    color: 'primary.main',
                    padding: '0 20px',
                    height: 40,
                }}
                onClick={handleShow}
                icon={<ClearAllIcon />}
                color="neutral"
            >
                {polyglot.t('clear_publish')}
            </Button>
            {show && <ClearDialog type="published" onClose={handleHide} />}
        </Box>
    );
};

ClearPublishedButtonComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

export const ClearPublishedButton = compose(
    translate,
    connect(mapStateToProps),
)(ClearPublishedButtonComponent);
