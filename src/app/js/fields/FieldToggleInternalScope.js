import React, { useEffect } from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import MainResourceIcon from '@material-ui/icons/InsertDriveFile';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FilterAtIcon from './FilterAt';

const useStyles = makeStyles({
    container: {
        marginRight: '1rem',
    },
});

export const FieldToggleInternalScopeComponent = ({ input }) => {
    const classes = useStyles();
    const [values, setValues] = React.useState([]);

    useEffect(() => {
        Array.isArray(input.value) && setValues(input.value);
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
                <MainResourceIcon />
            </ToggleButton>
            <ToggleButton value="subRessource" aria-label="centered">
                <FileCopyIcon />
            </ToggleButton>
            <ToggleButton value="facet" aria-label="centered">
                <FilterAtIcon />
            </ToggleButton>
            <ToggleButton value="chart" aria-label="right aligned">
                <EqualizerIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

FieldToggleInternalScopeComponent.propTypes = {
    input: PropTypes.object,
};

export default translate(FieldToggleInternalScopeComponent);
