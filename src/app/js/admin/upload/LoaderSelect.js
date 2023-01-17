import React, { useState } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import ListAltIcon from '@material-ui/icons/ListAlt';
import {
    Box,
    Button,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ListDialog from './ListDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import CustomLoader from './CustomLoader';

const useStyles = makeStyles({
    formControl: {
        minWidth: 200,
    },
    disableUppercase: {
        textTransform: 'initial',
    },
});

const LoaderSelectComponent = ({
    loaders,
    value,
    setLoader,
    p: polyglot,
    disabled,
}) => {
    const [openLoadersDialog, setOpenLoadersDialog] = useState(false);
    const [openCustomLoadersDialog, setOpenCustomLoadersDialog] = useState(
        false,
    );

    const classes = useStyles();

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
                marginBottom="10px"
                marginTop="60px"
            >
                <FormControl className={classes.formControl}>
                    <InputLabel id="select-loader-input-label" shrink={!!value}>
                        {polyglot.t('loader_name')}
                    </InputLabel>
                    <Select
                        className="select-loader"
                        labelId="select-loader-input-label"
                        onChange={e => setLoader(e.target.value)}
                        value={value}
                        autoWidth
                        disabled={disabled}
                    >
                        <MenuItem
                            className="select-loader-item"
                            key={'automatic'}
                            value={'automatic'}
                        >
                            {polyglot.t('automatic-loader')}
                        </MenuItem>
                        {loaders
                            .sort((x, y) =>
                                polyglot
                                    .t(x.name)
                                    .localeCompare(polyglot.t(y.name)),
                            )
                            .map(loader => (
                                <MenuItem
                                    className="select-loader-item"
                                    key={loader.name}
                                    value={loader.name}
                                >
                                    {polyglot.t(loader.name)}
                                </MenuItem>
                            ))}
                        {value === 'custom-loader' && (
                            <MenuItem
                                className="select-loader-item"
                                key={'custom-loader'}
                                value={'custom-loader'}
                            >
                                {polyglot.t('custom-loader')}
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>
                <Box mt="10px" ml="10px">
                    <Button
                        variant="contained"
                        className="open-loaders"
                        color="primary"
                        onClick={handleOpen}
                        disabled={disabled}
                    >
                        <ListAltIcon fontSize="small" />
                    </Button>
                </Box>
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginBottom="48px"
            >
                <Button
                    className={classes.disableUppercase}
                    color="primary"
                    onClick={() => setOpenCustomLoadersDialog(true)}
                    disabled={disabled || !value || value === 'automatic'}
                >
                    {polyglot.t(`add-custom-loader`)}
                </Button>
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
                handleClose={() => {
                    setOpenCustomLoadersDialog(false);
                }}
            />
        </Box>
    );
};

LoaderSelectComponent.propTypes = {
    loaders: PropTypes.array,
    setLoader: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    disabled: PropTypes.bool,
};

LoaderSelectComponent.defaultProps = {
    value: 'automatic',
};

export default compose(translate)(LoaderSelectComponent);
