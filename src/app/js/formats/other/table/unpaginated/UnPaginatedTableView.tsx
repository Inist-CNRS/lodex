import compose from 'recompose/compose';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import AbstractTableView from '../core/AbstractTableView';
import { Table, TableBody, TableContainer, TableRow } from '@mui/material';

import { translate } from '@lodex/frontend-common/i18n/I18NContext';

class UnPaginatedTableView extends AbstractTableView {
    render() {
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
