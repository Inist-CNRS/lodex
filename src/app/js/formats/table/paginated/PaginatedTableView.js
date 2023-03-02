import compose from 'recompose/compose';
import injectData from '../../injectData';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import AbstractTableView from '../core/AbstractTableView';
import { Table, TableBody, TableContainer, TableRow } from '@mui/material';
import React from 'react';

class PaginatedTableView extends AbstractTableView {
    onStateChange(state) {
        const filterFormatDataParameter = {
            skip: state.page * state.rowsPerPage,
            maxSize: state.rowsPerPage,
        };

        if (state.sortOn !== undefined && state.sort !== false)
            filterFormatDataParameter.sort = [state.sortOn, state.sort].join(
                '/',
            );

        this.setState(state, () =>
            this.props.filterFormatData(filterFormatDataParameter),
        );
    }

    render() {
        const { data, pageSize, total, p, columnsParameters } = this.props;

        return (
            <TableContainer>
                <Table>
                    {this.getTableHead(columnsParameters)}
                    <TableBody>
                        {this.sortData(data, columnsParameters).map(
                            (entry, index) => (
                                <TableRow key={`${index}-table`}>
                                    {columnsParameters.map(column =>
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
                    {this.getTableFooter(pageSize, total, p)}
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
