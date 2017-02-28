import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { TableRowColumn } from 'material-ui/Table';
import { connect } from 'react-redux';

import { fromFields } from '../selectors';

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

export const PublicationExcerptLineColComponent = ({
    value,
}) => (
    <TableRowColumn
        style={styles.cell}
    >
        {value}
    </TableRowColumn>
);

PublicationExcerptLineColComponent.propTypes = {
    value: PropTypes.string.isRequired,
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
