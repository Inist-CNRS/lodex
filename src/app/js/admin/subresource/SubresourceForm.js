import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { propTypes as reduxFormPropTypes, Field } from 'redux-form';
import {
    TextField as MUITextField,
    Grid,
    Button,
    ListItem,
    Typography,
    makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import classnames from 'classnames';
import SubressourceFieldAutoComplete from './SubressourceFieldAutoComplete';
import theme from '../../theme';
import { connect } from 'react-redux';
import { fromParsing } from '../selectors';

const useStyles = makeStyles({
    item: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.black.veryLight,
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottom: `1px solid ${theme.black.light}`,
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    selectedItem: {
        backgroundColor: theme.green.secondary,
        '&:hover': {
            backgroundColor: theme.green.primary,
        },
    },
});

const TextField = ({
    label,
    input,
    meta: { touched, invalid, error },
    ...custom
}) => (
    <MUITextField
        label={label}
        placeholder={label}
        error={touched && invalid}
        helperText={touched && error}
        {...input}
        {...custom}
    />
);

export const getKeys = value => {
    if (!value || value.length === 0) {
        return [];
    }
    if (typeof value === 'string') {
        try {
            value = JSON.parse(value);
        } catch (error) {
            return [];
        }
    }
    if (Array.isArray(value)) {
        if (value[0] && typeof value[0] === 'object') {
            return Object.keys(value[0]);
        }
        return [];
    }
    return Object.keys(value);
};

const SubresourceFormComponent = ({
    handleSubmit,
    pristine,
    submitting,
    additionnalActions,
    p: polyglot,
    datasetFields,
    excerptLines,
    pathSelected,
}) => {
    const classes = useStyles();
    const optionsIdentifier = useMemo(() => {
        const firstExcerptLine = excerptLines[0]?.[pathSelected] || [];
        return getKeys(firstExcerptLine);
    }, [excerptLines, pathSelected]);

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
            <Grid container align="center" style={{ marginBottom: 20 }}>
                <Grid item style={{ padding: 8 }}>
                    <Field
                        name="name"
                        autoFocus
                        component={TextField}
                        label={polyglot.t('subresource_name')}
                        fullWidth
                        aria-label="input-name"
                    />
                </Grid>
            </Grid>
            <Grid container align="center" style={{ marginBottom: 20 }}>
                <Grid item xs={6} style={{ padding: 8 }}>
                    <Field
                        className="path"
                        name="path"
                        type="text"
                        component={SubressourceFieldAutoComplete}
                        options={datasetFields}
                        renderInput={params => (
                            <MUITextField
                                {...params}
                                label={polyglot.t('subresource_path')}
                                variant="outlined"
                                aria-label="input-path"
                            />
                        )}
                        renderOption={(props, option, state) => {
                            return (
                                <ListItem
                                    {...props}
                                    className={classnames(classes.item, {
                                        [classes.selectedItem]: state.selected,
                                    })}
                                >
                                    <Typography>{option}</Typography>
                                </ListItem>
                            );
                        }}
                    />
                </Grid>
                <Grid item xs={6} style={{ padding: 8 }}>
                    <Field
                        className="identifier"
                        name="identifier"
                        type="text"
                        component={SubressourceFieldAutoComplete}
                        options={optionsIdentifier}
                        disabled={!pathSelected}
                        renderInput={params => (
                            <MUITextField
                                {...params}
                                label={polyglot.t('subresource_id')}
                                aria-label="input-identifier"
                                variant="outlined"
                            />
                        )}
                        renderOption={(props, option, state) => {
                            return (
                                <ListItem
                                    {...props}
                                    className={classnames(classes.item, {
                                        [classes.selectedItem]: state.selected,
                                    })}
                                >
                                    <Typography>{option}</Typography>
                                </ListItem>
                            );
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container align="center" justifyContent="space-between">
                <Grid item style={{ padding: 8 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={pristine || submitting}
                    >
                        OK
                    </Button>
                </Grid>
                {additionnalActions && (
                    <Grid item style={{ padding: 8 }}>
                        {additionnalActions}
                    </Grid>
                )}
            </Grid>
        </form>
    );
};

SubresourceFormComponent.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

TextField.propTypes = {
    label: PropTypes.string,
    input: PropTypes.shape({ name: PropTypes.string }),
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        invalid: PropTypes.bool,
        error: PropTypes.string,
    }),
};

const mapStateToProps = state => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
    excerptLines: fromParsing.getExcerptLines(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(SubresourceFormComponent);
