import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import PublicationExcerpt from './PublicationExcerpt';
import FieldForm from '../fields/FieldForm';
import { field as fieldPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
    },
    form: {
        borderLeft: '1px solid rgb(224, 224, 224)',
        marginLeft: '4rem',
        paddingLeft: '4rem',
    },
};

const PublicationEditionComponent = ({ editedColumn, lines }) => (
    <div style={styles.container}>
        <PublicationExcerpt
            columns={[editedColumn]}
            lines={lines}
            style={styles.column}
            onHeaderClick={null}
        />
        <div style={styles.form}>
            <FieldForm />
        </div>
    </div>
);

PublicationEditionComponent.propTypes = {
    editedColumn: fieldPropTypes.isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default compose(
    withHandlers({
        onHeaderClick: ({ onHeaderClick }) => () => onHeaderClick(null),
    }),
)(PublicationEditionComponent);
