// @ts-expect-error TS6133
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import ListDialog from './ListDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import CustomLoader from './CustomLoader';
import CancelButton from '../../lib/components/CancelButton';
import { translate } from '../../i18n/I18NContext';

const styles = {
    disableUppercase: {
        textTransform: 'initial',
    },
};

const LoaderSelectComponent = ({
    // @ts-expect-error TS7031
    loaders,
    // @ts-expect-error TS7031
    value,
    // @ts-expect-error TS7031
    setLoader,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    disabled,
}) => {
    const [openLoadersDialog, setOpenLoadersDialog] = useState(false);
    const [openCustomLoadersDialog, setOpenCustomLoadersDialog] =
        useState(false);

    const handleOpen = () => {
        setOpenLoadersDialog(true);
    };

    const handleClose = () => {
        setOpenLoadersDialog(false);
    };

    const actions = [
        <CancelButton key="cancel" onClick={handleClose}>
            {polyglot.t('cancel')}
        </CancelButton>,
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
                <TextField
                    select
                    sx={{ minWidth: 200 }}
                    className="select-loader"
                    label={polyglot.t('loader_name')}
                    onChange={(e) => setLoader(e.target.value)}
                    value={value}
                    // @ts-expect-error TS2322
                    autoWidth
                    disabled={disabled}
                    variant="standard"
                    InputLabelProps={{ shrink: !!value }}
                >
                    <MenuItem
                        className="select-loader-item"
                        key={'automatic'}
                        value={'automatic'}
                    >
                        {polyglot.t('automatic-loader')}
                    </MenuItem>
                    {loaders
                        // @ts-expect-error TS7006
                        .sort((x, y) =>
                            polyglot
                                .t(x.name)
                                .localeCompare(polyglot.t(y.name)),
                        )
                        // @ts-expect-error TS7006
                        .map((loader) => (
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
                </TextField>
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
                    sx={styles.disableUppercase}
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
                // @ts-expect-error TS2322
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

export default translate(LoaderSelectComponent);
