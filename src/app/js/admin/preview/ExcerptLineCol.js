import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { TableCell } from '@mui/material';
import { connect } from 'react-redux';

import { fromFields } from '../../sharedSelectors';
import { isLongText, getShortText } from '../../lib/longTexts';
import getFieldClassName from '../../lib/getFieldClassName';
import { field as fieldPropTypes } from '../../propTypes';
import parseValue from '../../../../common/tools/parseValue';

const styles = {
    cell: (readonly) => ({
        cursor: readonly ? 'default' : 'pointer',
        height: 'auto',
    }),
};

export const ExcerptLineColComponent = ({ field, value = '', readonly }) =>
    isLongText(value) ? (
        <TableCell
            title={value}
            sx={styles.cell(readonly)}
            className={classnames(
                'publication-preview-column',
                getFieldClassName(field),
            )}
        >
            {getShortText(value)}
        </TableCell>
    ) : (
        <TableCell
            sx={styles.cell(readonly)}
            className={classnames(
                'publication-preview-column',
                getFieldClassName(field),
            )}
        >
            {`${value}`}
        </TableCell>
    );

ExcerptLineColComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    value: PropTypes.string,
    readonly: PropTypes.bool,
};

ExcerptLineColComponent.defaultProps = {
    value: '',
};

const mapStateToProps = (state, { field, line }) => {
    const getLineCol = fromFields.getLineColGetter(state, field);
    const parsedValue = parseValue(getLineCol(line));
    return {
        value:
            typeof parsedValue === 'object'
                ? JSON.stringify(parsedValue)
                : parsedValue,
    };
};

export default compose(
    translate,
    connect(mapStateToProps),
)(ExcerptLineColComponent);
