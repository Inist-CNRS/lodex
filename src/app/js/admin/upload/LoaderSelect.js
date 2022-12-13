import React, { useState } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import SearchIcon from '@material-ui/icons/Search';
import { Grid, Box, Typography, Button } from '@material-ui/core';
import ListDialog from './ListDialog';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import theme from '../../theme';
import CustomLoader from './CustomLoader';

const styles = {
    button: {
        color: 'white',
        marginLeft: 4,
        marginRight: 4,
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        margin: 'auto',
        marginBottom: 25,
    },
    dividerHr: {
        flexGrow: 2,
        marginLeft: '1rem',
        marginRight: '1rem',
    },
    dividerLabel: {
        color: theme.green.primary,
        cursor: 'pointer',
    },
};

const LoaderSelectComponent = ({ loaders, value, setLoader, p: polyglot }) => {
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
        <div>
            <Grid
                container={true}
                direction="row"
                justifyContent="center"
                style={{
                    width: '100%',
                    marginBottom: 10,
                    marginTop: 25,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    style={{
                        display: 'grid',
                        alignContent: 'center',
                        marginRight: 20,
                    }}
                >
                    <Typography variant="h6" style={{ marginBottom: 10 }}>
                        2. {polyglot.t('loader_name')}
                    </Typography>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        style={styles.button}
                        className="open-loaders"
                        color={
                            value === 'custom-loader' ? 'secondary' : 'primary'
                        }
                        onClick={handleOpen}
                        fullWidth
                    >
                        {value === 'automatic'
                            ? polyglot.t('automatic-loader')
                            : polyglot.t(value)}
                        <SearchIcon
                            fontSize="large"
                            style={{ marginLeft: 20 }}
                        />
                    </Button>
                </Box>
            </Grid>
            <ListDialog
                open={openLoadersDialog}
                handleClose={handleClose}
                actions={actions}
                loaders={loaders}
                setLoader={setLoader}
                value={value}
            />

            <div style={styles.divider}>
                <hr style={styles.dividerHr} />
                <div
                    style={styles.dividerLabel}
                    onClick={() => setOpenCustomLoadersDialog(true)}
                >
                    {polyglot.t('add-custom-loader')}
                </div>
                <hr style={styles.dividerHr} />
            </div>
            <CustomLoader
                isOpen={openCustomLoadersDialog}
                handleClose={() => setOpenCustomLoadersDialog(false)}
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
