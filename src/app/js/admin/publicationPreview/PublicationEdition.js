import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import PublicationExcerpt from './PublicationExcerpt';
import FieldForm from '../fields/FieldForm';
import { field as fieldPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        paddingBottom: '1rem',
    },
    form: {
        borderRight: '1px solid rgb(224, 224, 224)',
        marginRight: '4rem',
        paddingRight: '4rem',
        flexGrow: 1,
    },
};

const PublicationEditionComponent = ({ editedColumn, lines }) => (
    <div style={styles.container}>
        <div style={styles.form}>
            <FieldForm />
        </div>
        <PublicationExcerpt
            className="publication-excerpt-for-edition"
            columns={[editedColumn]}
            lines={lines}
            style={styles.column}
            onHeaderClick={null}
        />
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
