import React from 'react';
import translate from 'redux-polyglot/translate';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import BarChartIcon from '@material-ui/icons/BarChart';
import theme from '../theme';
import classnames from 'classnames';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '1rem',
    },
    state: {
        padding: '0.5rem',
        border: '1px solid black',
    },
    stateSelected: {
        backgroundColor: theme.green.tertiary,
    },
});

export const FieldInternalStateComponent = ({ input }) => {
    const classes = useStyles();

    const handleStateSelected = state => {
        input.onChange(state === input.value ? '' : state);
    };

    return (
        <Box className={classes.container}>
            <Box
                onClick={() => handleStateSelected('home')}
                className={classnames(
                    {
                        [classes.stateSelected]: input.value === 'home',
                    },
                    classes.state,
                )}
            >
                <HomeIcon />
            </Box>
            <Box
                onClick={() => handleStateSelected('document')}
                className={classnames(
                    {
                        [classes.stateSelected]: input.value === 'document',
                    },
                    classes.state,
                )}
            >
                <DescriptionIcon />
            </Box>
            <Box
                onClick={() => handleStateSelected('chart')}
                className={classnames(
                    {
                        [classes.stateSelected]: input.value === 'chart',
                    },
                    classes.state,
                )}
            >
                <BarChartIcon />
            </Box>
        </Box>
    );
};

export default translate(FieldInternalStateComponent);
