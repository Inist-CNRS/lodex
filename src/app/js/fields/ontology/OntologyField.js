import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import Reorder from 'material-ui/svg-icons/editor/format-line-spacing';
import IconButton from 'material-ui/IconButton';

const DragHandle = SortableHandle(() => (
    <IconButton>
        <Reorder />
    </IconButton>
));

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import EditOntologyFieldButton from './EditOntologyFieldButton';
import { languages } from '../../../../../config.json';

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
};

const OntologyFieldComponent = ({ field, p: polyglot }) => (
    <TableRow>
        <TableRowColumn>
            {field.name !== 'uri' && <DragHandle />}
        </TableRowColumn>
        <TableRowColumn>{field.name}</TableRowColumn>
        <TableRowColumn>{field.label}</TableRowColumn>
        <TableRowColumn>
            {field.overview === 1 && <span style={styles.badge}>title</span>}
            {field.overview === 2 && (
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
        <TableRowColumn>
            <EditOntologyFieldButton field={field} />
        </TableRowColumn>
    </TableRow>
);

OntologyFieldComponent.propTypes = {
    field: fieldPropTypes,
    p: polyglotPropTypes.isRequired,
};

OntologyFieldComponent.defaultProps = {
    field: {},
};

export default compose(translate, SortableElement)(OntologyFieldComponent);
