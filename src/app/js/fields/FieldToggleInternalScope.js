import React, { useEffect } from 'react';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import MainResourceIcon from '@material-ui/icons/InsertDriveFile';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FilterAtIcon from './FilterAt';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles({
    container: {
        marginRight: '1rem',
    },
});

export const FieldToggleInternalScopeComponent = ({ input, p: polyglot }) => {
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
                <Tooltip title={polyglot.t('home_tooltip')}>
                    <HomeIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="document" aria-label="centered">
                <Tooltip title={polyglot.t('document_tooltip')}>
                    <MainResourceIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="subRessource" aria-label="centered">
                <Tooltip title={polyglot.t('subRessource_tooltip')}>
                    <FileCopyIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="facet" aria-label="centered">
                <Tooltip title={polyglot.t('facet_tooltip')}>
                    <FilterAtIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="chart" aria-label="right aligned">
                <Tooltip title={polyglot.t('chart_tooltip')}>
                    <EqualizerIcon />
                </Tooltip>
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

FieldToggleInternalScopeComponent.propTypes = {
    input: PropTypes.object,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldToggleInternalScopeComponent);
