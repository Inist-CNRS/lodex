import React, { useState } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import ArchiveIcon from '@material-ui/icons/Archive';
import { Button } from '@material-ui/core';
import ListDialog from './ListDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    button: {
        color: 'white',
        marginLeft: 4,
        marginRight: 4,
    },
};

const LoaderSelectComponent = ({ loaders, value, setLoader, p: polyglot }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const actions = [
        <Button
            variant="text"
            key="cancel"
            color="secondary"
            onClick={handleClose}
        >
            {polyglot.t('cancel')}
        </Button>,
    ];

    return (
        <div>
            <Button
                variant="contained"
                style={styles.button}
                className="open-loaders"
                color="primary"
                onClick={handleOpen}
                fullWidth
            >
                {polyglot.t('loader_name')} :{' '}
                {value === 'automatic'
                    ? polyglot.t('automatic-loader')
                    : polyglot.t(value)}
            </Button>
            <ListDialog
                open={open}
                handleClose={handleClose}
                actions={actions}
                loaders={loaders}
                setLoader={setLoader}
                value={value}
            />
        </div>
    );
};

LoaderSelectComponent.propTypes = {
    loaders: PropTypes.array,
    setLoader: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

LoaderSelectComponent.defaultProps = {
    value: 'automatic',
};

export default compose(translate)(LoaderSelectComponent);
