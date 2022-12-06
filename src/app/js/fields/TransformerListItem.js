import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { IconButton, ListItem, TextField, Typography } from '@material-ui/core';
import ActionDeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { Field, FieldArray } from 'redux-form';
import memoize from 'lodash.memoize';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromFields } from '../sharedSelectors';
import TransformerArgList from './TransformerArgList';
import { changeOperation } from './';
import theme from '../theme';
import TransformerAutoComplete from './TransformerAutoComplete';

const styles = {
    container: memoize(show => ({
        alignItems: 'center',
        gap: '6px',
        display: show ? 'flex' : 'none',
        marginBottom: '1rem',
    })),
};

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

const TransformerListItem = ({
    availableTransformers,
    fieldName,
    onRemove,
    p: polyglot,
    onChangeOperation,
    show,
}) => {
    const classes = useStyles();
    return (
        <div style={styles.container(show)}>
            <Field
                className="operation"
                name={`${fieldName}.operation`}
                type="text"
                onChange={(_, operation) =>
                    onChangeOperation({ operation, fieldName })
                }
                component={TransformerAutoComplete}
                options={availableTransformers}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={polyglot.t('select_an_operation')}
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
                            <Typography variant="body2" color="textSecondary">
                                {polyglot.t(`transformer_${option}`)}
                            </Typography>
                        </ListItem>
                    );
                }}
            />
            <FieldArray
                name={`${fieldName}.args`}
                component={TransformerArgList}
            />
            <IconButton
                tooltip={polyglot.t('remove_transformer')}
                onClick={onRemove}
            >
                <ActionDeleteIcon />
            </IconButton>
        </div>
    );
};

TransformerListItem.propTypes = {
    availableTransformers: PropTypes.arrayOf(PropTypes.string.isRequired)
        .isRequired,
    onChangeOperation: PropTypes.func.isRequired,
    fieldName: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    show: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, { operation, type }) => ({
    availableTransformers: fromFields
        .getTransformers(state, type)
        .map(transformer => transformer.name),
    transformerArgs: fromFields.getTransformerArgs(state, operation),
});

const mapDispatchToProps = {
    onChangeOperation: changeOperation,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(TransformerListItem);
