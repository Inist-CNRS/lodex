import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import ClearDialog from '../Appbar/ClearDialog';
import { fromPublication } from '../selectors';
import { useTranslate } from '../../i18n/I18NContext';

// @ts-expect-error TS7031
export const ClearPublishedButtonComponent = ({ hasPublishedDataset }) => {
    const { translate } = useTranslate();
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
                // @ts-expect-error TS2769
                color="neutral"
            >
                {translate('clear_publish')}
            </Button>
            {/*
             // @ts-expect-error TS2322 */}
            {show && <ClearDialog type="published" onClose={handleHide} />}
        </Box>
    );
};

ClearPublishedButtonComponent.propTypes = {
    hasPublishedDataset: PropTypes.bool.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

export const ClearPublishedButton = connect(mapStateToProps)(
    ClearPublishedButtonComponent,
);
