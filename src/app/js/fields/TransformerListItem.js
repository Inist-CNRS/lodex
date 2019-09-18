import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { IconButton, MenuItem } from '@material-ui/core';
import { Delete as ActionDeleteIcon } from '@material-ui/icons';
import { Field, FieldArray } from 'redux-form';
import memoize from 'lodash.memoize';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromFields } from '../sharedSelectors';
import FormSelectField from '../lib/components/FormSelectField';
import TransformerArgList from './TransformerArgList';
import { changeOperation } from './';

const styles = {
    container: memoize(show => ({
        alignItems: 'flex-end',
        display: show ? 'flex' : 'none',
    })),
};

const TransformerListItem = ({
    availableTransformers,
    fieldName,
    onRemove,
    p: polyglot,
    onChangeOperation,
    show,
}) => (
    <div style={styles.container(show)}>
        <Field
            className="operation"
            name={`${fieldName}.operation`}
            type="text"
            onChange={(_, operation) =>
                onChangeOperation({ operation, fieldName })
            }
            component={FormSelectField}
            label={polyglot.t('select_an_operation')}
        >
            {availableTransformers.map(t => (
                <MenuItem
                    key={t.name}
                    className={`transformer_${t.name}`}
                    value={t.name}
                >
                    {t.name}
                </MenuItem>
            ))}
        </Field>
        <FieldArray name={`${fieldName}.args`} component={TransformerArgList} />
        <IconButton
            tooltip={polyglot.t('remove_transformer')}
            onClick={onRemove}
        >
            <ActionDeleteIcon />
        </IconButton>
    </div>
);

TransformerListItem.propTypes = {
    availableTransformers: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            args: PropTypes.arrayOf(PropTypes.any).isRequired,
        }),
    ).isRequired,
    onChangeOperation: PropTypes.func.isRequired,
    fieldName: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    show: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, { operation, type }) => ({
    availableTransformers: fromFields.getTransformers(state, type),
    transformerArgs: fromFields.getTransformerArgs(state, operation),
});

const mapDispatchToProps = {
    onChangeOperation: changeOperation,
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
)(TransformerListItem);
