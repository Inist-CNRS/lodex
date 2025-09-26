import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import ActionDeleteIcon from '@mui/icons-material/Delete';
import { translate } from '../../i18n/I18NContext';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
// @ts-expect-error TS7016
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
};

export const ConcatFieldComponent = ({
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    handleChange,
    // @ts-expect-error TS7031
    handleRemoveColumn,
    // @ts-expect-error TS7031
    column,
    // @ts-expect-error TS7031
    removable,
    // @ts-expect-error TS7031
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
            // @ts-expect-error TS2769
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
    column: '',
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    datasetFields: fromParsing.getParsedExcerptColumns(state),
});

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleChange:
            // @ts-expect-error TS7031
            ({ handleChange, index }) =>
            // @ts-expect-error TS7006
            (event, key, value) =>
                handleChange(event, key, value, index),
        // @ts-expect-error TS7031
        handleRemoveColumn: ({ handleRemoveColumn, index }) =>
            handleRemoveColumn(index),
    }),
    translate,
)(ConcatFieldComponent);
