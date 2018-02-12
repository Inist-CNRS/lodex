import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { SortableElement } from 'react-sortable-hoc';
import DragButton from './DragButton';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import EditOntologyFieldButton from './EditOntologyFieldButton';
import { languages } from '../../../../../config.json';
import { fromCharacteristic } from '../../sharedSelectors';
import EditButton from '../editFieldValue/EditButton';
import { COVER_DATASET } from '../../../../common/cover';

const styles = {
    badge: {
        fontFamily:
            '"Lato", "Lucida Grande", "Lucida Sans Unicode", Tahoma, Sans-Serif',
        fontSize: '70%',
        fontWeight: '700',
        textTransform: 'uppercase',
        padding: '2px 3px 1px 3px',
        marginLeft: '4px',
        color: '#FFFFFF',
        borderRadius: '3px',
        textShadow: 'none !important',
        whiteSpace: 'nowrap',
        backgroundColor: '#8B8B8B',
    },
    actionCol: {
        overflow: 'visible',
    },
};

const OntologyFieldComponent = ({ field, characteristics, p: polyglot }) => (
    <TableRow>
        <TableRowColumn style={styles.actionCol}>
            <DragButton disabled={field.name === 'uri'} />
            {field.cover === COVER_DATASET && (
                <EditButton field={field} resource={characteristics} />
            )}
            <EditOntologyFieldButton field={field} />
        </TableRowColumn>
        <TableRowColumn>{field.name}</TableRowColumn>
        <TableRowColumn>
            {field.label}
            {(field.overview === 1 || field.overview === 100) && (
                <span style={styles.badge}>title</span>
            )}
            {(field.overview === 2 || field.overview === 200) && (
                <span style={styles.badge}>description</span>
            )}
        </TableRowColumn>
        <TableRowColumn>{polyglot.t(`cover_${field.cover}`)}</TableRowColumn>
        <TableRowColumn>
            {field.scheme && <a href={field.scheme}>{field.scheme}</a>}
        </TableRowColumn>
        <TableRowColumn>{field.count || 1}</TableRowColumn>
        <TableRowColumn>
            {field.language &&
                languages.find(l => l.code === field.language).label}
        </TableRowColumn>
    </TableRow>
);

OntologyFieldComponent.propTypes = {
    field: fieldPropTypes,
    characteristics: PropTypes.object.isRequired,
    p: polyglotPropTypes.isRequired,
};

OntologyFieldComponent.defaultProps = {
    field: {},
};

const mapStateToProps = state => ({
    characteristics: fromCharacteristic.getCharacteristicsAsResource(state),
});

export default compose(translate, SortableElement, connect(mapStateToProps))(
    OntologyFieldComponent,
);
