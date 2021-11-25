import React, { useEffect } from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import BarChartIcon from '@material-ui/icons/BarChart';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import SortIcon from '@material-ui/icons/Sort';

const useStyles = makeStyles({
    container: {
        marginRight: '1rem',
    },
});

export const FieldToggleInternalScopeComponent = ({ input }) => {
    const classes = useStyles();
    const [values, setValues] = React.useState([]);

    useEffect(() => {
        setValues(input.value);
    }, [input.value]);

    const handleStateSelected = (event, newValues) => {
        setValues(newValues);
        input.onChange(newValues);
    };

    return (
        <ToggleButtonGroup
            value={values}
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
            <ToggleButton value="subRessource" aria-label="centered">
                <DescriptionOutlinedIcon />
            </ToggleButton>
            <ToggleButton value="facet" aria-label="centered">
                <SortIcon />
            </ToggleButton>
            <ToggleButton value="chart" aria-label="right aligned">
                <BarChartIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

FieldToggleInternalScopeComponent.propTypes = {
    input: PropTypes.object,
};

export default translate(FieldToggleInternalScopeComponent);
