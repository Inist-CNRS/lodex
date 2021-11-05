import React from 'react';
import translate from 'redux-polyglot/translate';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import BarChartIcon from '@material-ui/icons/BarChart';
import theme from '../theme';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles({
    container: {
        marginRight: '1rem',
    },
});

export const FieldInternalStateComponent = ({ input }) => {
    const classes = useStyles();

    const handleStateSelected = (event, state) => {
        input.onChange(state === input.value ? '' : state);
    };

    return (
        <ToggleButtonGroup
            value={input.value}
            exclusive
            onChange={handleStateSelected}
            aria-label="text alignment"
            className={classes.container}
        >
            <ToggleButton value="home" aria-label="left aligned">
                <HomeIcon />
            </ToggleButton>
            <ToggleButton value="document" aria-label="centered">
                <DescriptionIcon />
            </ToggleButton>
            <ToggleButton value="chart" aria-label="right aligned">
                <BarChartIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default translate(FieldInternalStateComponent);
