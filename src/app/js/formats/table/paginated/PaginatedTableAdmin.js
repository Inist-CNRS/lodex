import AbstractTableAdmin from '../core/AbstractTableAdmin';
import translate from 'redux-polyglot/translate';
import RoutineParamsAdmin from '../../shared/RoutineParamsAdmin';
import { TextField } from '@material-ui/core';
import TableColumnsParameters from '../core/TableColumnsParameters';
import React from 'react';

export const defaultArgs = {
    pageSize: 6,
    params: {
        maxSize: 6,
        orderBy: 'value/asc',
    },
    columnsCount: 0,
    columnsParameters: [],
};

class PaginatedTableAdmin extends AbstractTableAdmin {
    static defaultProps = {
        args: defaultArgs,
    };

    render() {
        const {
            p: polyglot,
            args: { params, pageSize, columnsCount, columnsParameters },
        } = this.props;
        return (
            <div style={this.styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={this.setParams}
                    polyglot={polyglot}
                    showMaxSize={true}
                    showMaxValue={false}
                    showMinValue={false}
                    showOrderBy={false}
                />
                <TextField
                    label={polyglot.t('items_per_page')}
                    onChange={this.setPageSize}
                    style={this.styles.input}
                    value={pageSize}
                    type="number"
                />
                <TableColumnsParameters
                    onChange={this.setColumnParameter}
                    polyglot={polyglot}
                    parameterCount={columnsCount}
                    parameters={columnsParameters}
                />
            </div>
        );
    }
}

export default translate(PaginatedTableAdmin);
