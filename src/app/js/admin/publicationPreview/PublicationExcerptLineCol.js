import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { TableRowColumn } from 'material-ui/Table';
import { connect } from 'react-redux';

import { fromFields } from '../selectors';
import { isLongText, getShortText } from '../../lib/longTexts';

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
    },
};

export const PublicationExcerptLineColComponent = ({ value }) => (
    isLongText(value)
    ? (
        <TableRowColumn title={value} style={styles.cell}>
            {getShortText(value)}
        </TableRowColumn>
    )
    : <TableRowColumn style={styles.cell}>{value}</TableRowColumn>
);

PublicationExcerptLineColComponent.propTypes = {
    value: PropTypes.string,
};

PublicationExcerptLineColComponent.defaultProps = {
    value: null,
};

const mapStateToProps = (state, { field, line }) => {
    const getLineCol = fromFields.getLineColGetter(state, field);

    return {
        value: getLineCol(line),
    };
};

export default compose(
    translate,
    connect(mapStateToProps),
)(PublicationExcerptLineColComponent);
