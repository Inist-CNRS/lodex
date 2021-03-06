import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { TableRow, TableCell } from '@material-ui/core';
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
import { SCOPE_DATASET } from '../../../../common/scope';
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
};

const OntologyFieldComponent = ({ field, characteristics, p: polyglot }) => (
    <TableRow>
        <TableCell style={styles.actionCol}>
            <DragButton disabled={field.name === 'uri'} />
            {field.scope === SCOPE_DATASET && (
                <EditButton
                    field={field}
                    resource={{ ...characteristics, name: field.name }}
                />
            )}
            <EditOntologyFieldButton field={field} />
        </TableCell>
        <TableCell>{field.name}</TableCell>
        <TableCell>
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
        </TableCell>
        <TableCell>{polyglot.t(`scope_${field.scope}`)}</TableCell>
        <TableCell>
            {field.scheme && <Link href={field.scheme}>{field.scheme}</Link>}
        </TableCell>
        <TableCell>{field.count || 1}</TableCell>
        <TableCell>
            {field.language &&
                languages.find(l => l.code === field.language).label}
        </TableCell>
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
