import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { propTypes as reduxFormPropTypes, Field } from 'redux-form';
import { TextField as MUITextField, Grid, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import { polyglot as polyglotPropTypes } from '../../propTypes';

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

const SubresourceFormComponent = ({
    handleSubmit,
    pristine,
    submitting,
    additionnalActions,
    p: polyglot,
}) => (
    <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
        <Grid container align="center">
            <Grid item style={{ padding: 8 }}>
                <Field
                    name="name"
                    autoFocus
                    component={TextField}
                    label={polyglot.t('subresource_name')}
                    fullWidth
                />
            </Grid>
        </Grid>
        <Grid container align="center">
            <Grid item xs={6} style={{ padding: 8 }}>
                <Field
                    name="identifier"
                    component={TextField}
                    label={polyglot.t('subresource_id')}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} style={{ padding: 8 }}>
                <Field
                    name="path"
                    component={TextField}
                    label={polyglot.t('subresource_path')}
                    fullWidth
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

export default compose(translate)(SubresourceFormComponent);
