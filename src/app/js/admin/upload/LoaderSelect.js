import React, { useState } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import SearchIcon from '@material-ui/icons/Search';
import BuildIcon from '@material-ui/icons/Build';
import { Box, Typography, Button, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ListDialog from './ListDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import theme from '../../theme';
import CustomLoader from './CustomLoader';
import classNames from 'classnames';

const useStyles = makeStyles({
    button: {
        color: 'white',
        marginLeft: 12,
        marginRight: 4,
    },
    customLoader: {
        color: theme.purple.primary,
    },
});

const LoaderSelectComponent = ({ loaders, value, setLoader, p: polyglot }) => {
    const classes = useStyles();
    const [openLoadersDialog, setOpenLoadersDialog] = useState(false);
    const [openCustomLoadersDialog, setOpenCustomLoadersDialog] = useState(
        false,
    );

    const handleOpen = () => {
        setOpenLoadersDialog(true);
    };

    const handleClose = () => {
        setOpenLoadersDialog(false);
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
        <Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginBottom="48px"
                marginTop="60px"
            >
                <Typography variant="h6">
                    {polyglot.t('loader_name')}
                </Typography>
                <Button
                    variant="contained"
                    className={classNames(classes.button, 'open-loaders')}
                    color="primary"
                    onClick={handleOpen}
                >
                    <SearchIcon fontSize="medium" />
                </Button>
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginBottom="48px"
                marginTop="48px"
            >
                <Typography
                    className={
                        value === 'custom-loader' && classes.customLoader
                    }
                >
                    {value === 'automatic'
                        ? polyglot.t('automatic-loader')
                        : polyglot.t(value)}
                </Typography>
                <Tooltip title={polyglot.t(`add-custom-loader`)}>
                    <Button
                        variant="contained"
                        className={classes.button}
                        color="primary"
                        onClick={() => setOpenCustomLoadersDialog(true)}
                    >
                        <BuildIcon fontSize="medium" />
                    </Button>
                </Tooltip>
            </Box>
            <ListDialog
                open={openLoadersDialog}
                handleClose={handleClose}
                actions={actions}
                loaders={loaders}
                setLoader={setLoader}
                value={value}
            />
            <CustomLoader
                isOpen={openCustomLoadersDialog}
                handleClose={() => setOpenCustomLoadersDialog(false)}
            />
        </Box>
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
