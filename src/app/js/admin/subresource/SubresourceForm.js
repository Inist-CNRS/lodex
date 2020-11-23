import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { propTypes as reduxFormPropTypes, Field } from 'redux-form';
import { TextField as MUITextField, Grid, Button } from '@material-ui/core';

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

const SubresourceFormComponent = ({ handleSubmit, pristine, submitting }) => (
    <form onSubmit={handleSubmit}>
        <Grid container align="center">
            <Grid item style={{ padding: 8 }}>
                <Field name="name" component={TextField} label="Name" />
            </Grid>
        </Grid>
        <Grid container align="center">
            <Grid item xs={6} style={{ padding: 8 }}>
                <Field
                    name="identifier"
                    component={TextField}
                    label="Identifier"
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} style={{ padding: 8 }}>
                <Field name="path" component={TextField} label="Path" />
            </Grid>
        </Grid>
        <Grid container align="center">
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
        </Grid>
    </form>
);

SubresourceFormComponent.propTypes = reduxFormPropTypes;

export default compose(translate)(SubresourceFormComponent);
