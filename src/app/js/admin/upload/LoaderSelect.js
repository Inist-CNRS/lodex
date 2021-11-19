import React, { useState } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import SearchIcon from '@material-ui/icons/Search';
import { Grid, Box, Typography, Button } from '@material-ui/core';
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
            <Grid
                display
                container={true}
                direction="row"
                justify="center"
                style={{
                    width: '100%',
                    marginBottom: 25,
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
                        color="primary"
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
