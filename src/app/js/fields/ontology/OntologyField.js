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
import languages from '../../../../common/languages';
import { fromCharacteristic } from '../../sharedSelectors';
import EditButton from '../editFieldValue/EditButton';
import { COVER_DATASET } from '../../../../common/cover';
import * as overview from '../../../../common/overview';
import Link from '../../lib/components/Link';

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
                <EditButton
                    field={field}
                    resource={{ ...characteristics, name: field.name }}
                />
            )}
            <EditOntologyFieldButton field={field} />
        </TableRowColumn>
        <TableRowColumn>{field.name}</TableRowColumn>
        <TableRowColumn>
            {field.label}
            {(field.overview === overview.RESOURCE_TITLE ||
                field.overview === overview.DATASET_TITLE) && (
                <span style={styles.badge}>title</span>
            )}
            {(field.overview === overview.RESOURCE_DESCRIPTION ||
                field.overview === overview.DATASET_DESCRIPTION) && (
                <span style={styles.badge}>description</span>
            )}
            {field.overview === overview.RESOURCE_DETAIL_1 && (
                <span style={styles.badge}>detail 1</span>
            )}
            {field.overview === overview.RESOURCE_DETAIL_2 && (
                <span style={styles.badge}>detail 2</span>
            )}
        </TableRowColumn>
        <TableRowColumn>{polyglot.t(`cover_${field.cover}`)}</TableRowColumn>
        <TableRowColumn>
            {field.scheme && <Link href={field.scheme}>{field.scheme}</Link>}
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

export default compose(
    translate,
    SortableElement,
    connect(mapStateToProps),
)(OntologyFieldComponent);
