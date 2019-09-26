import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { Table, TableHead, TableCell, TableRow } from '@material-ui/core';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { changePosition } from '../';
import OntologyFieldList from './OntologyFieldList';
import { fromFields } from '../../sharedSelectors';

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
        const { handleChangePosition, title } = this.props;
        handleChangePosition({
            newPosition: newIndex,
            oldPosition: oldIndex,
            type: title,
        });
    };

    render() {
        const { title, fields, p: polyglot } = this.props;

        return (
            <div className={`ontology-table-${title}`}>
                <h4>{polyglot.t(title)}</h4>
                <Table fixedHeader={false} style={styles.table}>
                    <TableHead
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                    >
                        <TableRow>
                            <TableCell />
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
    title: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, { title }) => ({
    fields: fromFields.getOntologyFields(state, title),
});

const mapDispatchToProps = {
    changePositionAction: changePosition,
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    withHandlers({
        handleChangePosition: ({ changePositionAction }) => field => {
            changePositionAction(field);
        },
    }),
    translate,
)(OntologyTable);
