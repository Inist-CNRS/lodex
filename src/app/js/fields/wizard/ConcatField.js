/* eslint react/no-array-index-key: off */

import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { Delete as ActionDeleteIcon } from '@material-ui/icons';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import SelectDatasetField from './SelectDatasetField';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromParsing } from '../../admin/selectors';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    select: {
        width: '100%',
    },
};

export const ConcatFieldComponent = ({
    p: polyglot,
    handleChange,
    handleRemoveColumn,
    column,
    removable,
    index,
}) => (
    <div style={styles.container}>
        <SelectDatasetField
            id={`select-column-${index}`}
            label="select_a_column"
            column={column}
            handleChange={handleChange}
        />
        {removable && (
            <IconButton
                tooltip={polyglot.t('remove_column')}
                onClick={handleRemoveColumn}
            >
                <ActionDeleteIcon />
            </IconButton>
        )}
    </div>
);

ConcatFieldComponent.propTypes = {
    column: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    handleRemoveColumn: PropTypes.func.isRequired,
    removable: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    index: PropTypes.number.isRequired,
};

ConcatFieldComponent.defaultProps = {
    column: null,
};

const mapStateToProps = state => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
});

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleChange: ({ handleChange, index }) => (event, key, value) =>
            handleChange(event, key, value, index),
        handleRemoveColumn: ({ handleRemoveColumn, index }) =>
            handleRemoveColumn(index),
    }),
    translate,
)(ConcatFieldComponent);
