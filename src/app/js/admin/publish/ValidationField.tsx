// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { ListItem, IconButton, Grid, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import {
    polyglot as polyglotPropTypes,
    validationField as validationFieldPropType,
} from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import { connect } from 'react-redux';
import { translate } from '../../i18n/I18NContext';

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
    // @ts-expect-error TS7031
    onEditField,
    // @ts-expect-error TS7031
    field: { label, properties },
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
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
                        // @ts-expect-error TS7006
                        .filter((p) => !p.isValid)
                        // @ts-expect-error TS7006
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    isFieldsLoading: fromFields.isLoading(state),
});

export default compose(
    connect(mapStateToProps),
    withHandlers({
        // @ts-expect-error TS7006
        onEditField: (props) => (event) => {
            event.preventDefault();
            // @ts-expect-error TS18046
            props.onEditField(props.field.name);
        },
    }),
    translate,
    // @ts-expect-error TS2345
)(ValidationFieldComponent);
