// @ts-expect-error TS7016
import compose from 'recompose/compose';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import AbstractTableView from '../core/AbstractTableView';
import { Table, TableBody, TableContainer, TableRow } from '@mui/material';
import React from 'react';
import { translate } from '../../../../i18n/I18NContext';

class UnPaginatedTableView extends AbstractTableView {
    render() {
        // @ts-expect-error TS2339
        const { data, columnsParameters } = this.props;

        return (
            <TableContainer>
                <Table>
                    {this.getTableHead(columnsParameters)}
                    <TableBody>
                        {this.sortData(data, columnsParameters).map(
                            // @ts-expect-error TS7006
                            (entry, index) => (
                                <TableRow key={`${index}-table`}>
                                    {/*
                                     // @ts-expect-error TS7006 */}
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
    // @ts-expect-error TS2345
    injectData(null, (field) => !!field),
    connect(AbstractTableView.mapStateToProps),
    translate,
)(UnPaginatedTableView);
