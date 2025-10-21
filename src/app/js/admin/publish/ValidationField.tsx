import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { ListItem, IconButton, Grid, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { type ValidationFieldProps } from '../../propTypes';
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

interface ValidationFieldComponentProps {
    field: ValidationFieldProps;
    onEditField(field: ValidationFieldProps): void;
    p: unknown;
    isFieldsLoading?: boolean;
}

const ValidationFieldComponent = ({
    onEditField,
    field: { label, properties },
    p: polyglot,
    isFieldsLoading,
}: ValidationFieldComponentProps) => (
    <ListItem
        // @ts-expect-error TS2769
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
                                {/*
                                 // @ts-expect-error TS18046 */}
                                {polyglot.t(
                                    `error_${p.name}_${p.error}`,
                                    // @ts-expect-error TS18046
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
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
