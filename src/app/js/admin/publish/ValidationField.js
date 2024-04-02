import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { ListItem, IconButton, Grid, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import {
    polyglot as polyglotPropTypes,
    validationField as validationFieldPropType,
} from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import { connect } from 'react-redux';

const styles = {
    label: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginRight: '0.5rem',
        textDecoration: 'underline',
        outline: 'none',
    },
};

const ValidationFieldComponent = ({
    onEditField,
    field: { label, properties },
    p: polyglot,
    isFieldsLoading,
}) => (
    <ListItem
        onClick={!isFieldsLoading && onEditField}
        disabled={isFieldsLoading}
    >
        <Grid container alignItems="center">
            <Grid item sx={{ minWidth: 250 }}>
                <Box sx={styles.label}>{label}:</Box>
            </Grid>
            <Grid item>
                <ul>
                    {properties
                        .filter((p) => !p.isValid)
                        .map((p) => (
                            <li key={`${p.name}_${p.error}`}>
                                {polyglot.t(
                                    `error_${p.name}_${p.error}`,
                                    p.meta,
                                )}
                            </li>
                        ))}
                </ul>
            </Grid>
            <Grid item sx={{ width: 70, textAlign: 'center' }}>
                <IconButton disabled={isFieldsLoading}>
                    <EditIcon />
                </IconButton>
            </Grid>
        </Grid>
    </ListItem>
);

ValidationFieldComponent.propTypes = {
    field: validationFieldPropType.isRequired,
    onEditField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    isFieldsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isFieldsLoading: fromFields.isLoading(state),
});

export default compose(
    connect(mapStateToProps),
    withHandlers({
        onEditField: (props) => (event) => {
            event.preventDefault();
            props.onEditField(props.field.name);
        },
    }),
    translate,
)(ValidationFieldComponent);
