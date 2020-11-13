import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { Table, TableHead, TableCell, TableRow } from '@material-ui/core';

import { changePosition } from '../';
import OntologyFieldList from './OntologyFieldList';
import { fromFields } from '../../sharedSelectors';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

const styles = {
    table: {
        tableLayout: 'auto',
        width: 'auto',
        minWidth: '100%',
        overflowX: 'auto',
        display: 'block',
    },
};

class OntologyTable extends Component {
    handleSortEnd = ({ oldIndex, newIndex }) => {
        const { handleChangePosition, filter } = this.props;
        handleChangePosition({
            newPosition: newIndex,
            oldPosition: oldIndex,
            type: filter,
        });
    };

    render() {
        const { filter, fields, p: polyglot } = this.props;

        return (
            <div className={`ontology-table-${filter}`}>
                <Table style={styles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ minWidth: 150 }} />
                            <TableCell>{polyglot.t('identifier')}</TableCell>
                            <TableCell>{polyglot.t('label')}</TableCell>
                            <TableCell>{polyglot.t('cover')}</TableCell>
                            <TableCell>{polyglot.t('scheme')}</TableCell>
                            <TableCell>
                                {polyglot.t('count_of_field')}
                            </TableCell>
                            <TableCell>{polyglot.t('language')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <OntologyFieldList
                        lockAxis="y"
                        useDragHandle
                        items={fields}
                        onSortEnd={this.handleSortEnd}
                    />
                </Table>
            </div>
        );
    }
}

OntologyTable.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    handleChangePosition: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, { filter }) => ({
    fields: fromFields.getFromFilterFields(state, filter),
});

const mapDispatchToProps = {
    changePositionAction: changePosition,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleChangePosition: ({ changePositionAction }) => field => {
            changePositionAction(field);
        },
    }),
    translate,
)(OntologyTable);
