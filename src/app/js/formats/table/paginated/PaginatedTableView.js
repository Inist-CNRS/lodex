import compose from 'recompose/compose';
import injectData from '../../injectData';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import AbstractTableView from '../core/AbstractTableView';
import { Table, TableBody, TableContainer, TableRow } from '@material-ui/core';
import React from 'react';

class PaginatedTableView extends AbstractTableView {
    render() {
        const { data, pageSize, p, columnsParameters } = this.props;

        return (
            <TableContainer>
                <Table>
                    {this.getTableHead(columnsParameters)}
                    <TableBody>
                        {this.sortData(data, columnsParameters)
                            .slice(
                                this.state.page * this.state.rowsPerPage,
                                this.state.page * this.state.rowsPerPage +
                                    this.state.rowsPerPage,
                            )
                            .map((entry, index) => (
                                <TableRow key={`${index}-table`}>
                                    {columnsParameters.map(column =>
                                        this.getCellInnerHtml(
                                            entry,
                                            index,
                                            column,
                                        ),
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                    {this.getTableFooter(pageSize, data, p)}
                </Table>
            </TableContainer>
        );
    }
}

export default compose(
    injectData(null, field => !!field),
    connect(AbstractTableView.mapStateToProps),
    translate,
)(PaginatedTableView);
