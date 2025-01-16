import compose from 'recompose/compose';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import AbstractTableView from '../core/AbstractTableView';
import { Table, TableBody, TableContainer, TableRow } from '@mui/material';
import React from 'react';

class UnPaginatedTableView extends AbstractTableView {
    render() {
        const { data, columnsParameters } = this.props;

        return (
            <TableContainer>
                <Table>
                    {this.getTableHead(columnsParameters)}
                    <TableBody>
                        {this.sortData(data, columnsParameters).map(
                            (entry, index) => (
                                <TableRow key={`${index}-table`}>
                                    {columnsParameters.map((column) =>
                                        this.getCellInnerHtml(
                                            entry,
                                            index,
                                            column,
                                        ),
                                    )}
                                </TableRow>
                            ),
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default compose(
    injectData(null, (field) => !!field),
    connect(AbstractTableView.mapStateToProps),
    translate,
)(UnPaginatedTableView);
