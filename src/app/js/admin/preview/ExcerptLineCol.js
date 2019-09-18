import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { TableRowColumn } from '@material-ui/core/Table';
import { connect } from 'react-redux';

import { fromFields } from '../../sharedSelectors';
import { isLongText, getShortText } from '../../lib/longTexts';
import getFieldClassName from '../../lib/getFieldClassName';
import { field as fieldPropTypes } from '../../propTypes';

const styles = {
    header: {
        cursor: 'pointer',
    },
    table: {
        width: 'auto',
    },
    wrapper: {
        overflowX: 'auto',
    },
    cell: {
        cursor: 'pointer',
        height: 'auto',
    },
};

export const ExcerptLineColComponent = ({ field, value = '' }) =>
    isLongText(value) ? (
        <TableRowColumn
            title={value}
            style={styles.cell}
            className={classnames(
                'publication-preview-column',
                getFieldClassName(field),
            )}
        >
            {getShortText(value)}
        </TableRowColumn>
    ) : (
        <TableRowColumn
            style={styles.cell}
            className={classnames(
                'publication-preview-column',
                getFieldClassName(field),
            )}
        >
            {value}
        </TableRowColumn>
    );

ExcerptLineColComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    value: PropTypes.string,
};

ExcerptLineColComponent.defaultProps = {
    value: '',
};

const mapStateToProps = (state, { field, line }) => {
    const getLineCol = fromFields.getLineColGetter(state, field);
    const value = getLineCol(line) || '';

    return {
        value: typeof value === 'object' ? JSON.stringify(value) : value,
    };
};

export default compose(
    translate,
    connect(mapStateToProps),
)(ExcerptLineColComponent);
