import AbstractTableAdmin from '../core/AbstractTableAdmin';
import translate from 'redux-polyglot/translate';
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

    setColumnParameter = args => {
        this.props.onChange({
            ...this.props.args,
            params: {
                maxSize: args.parameterCount,
            },
            columnsCount: args.parameterCount,
            columnsParameters: args.parameters,
        });
    };

    render() {
        const {
            p: polyglot,
            args: { pageSize, columnsCount, columnsParameters },
        } = this.props;
        return (
            <div style={this.styles.container}>
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
