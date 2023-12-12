import AbstractTableAdmin from '../core/AbstractTableAdmin';
import translate from 'redux-polyglot/translate';
import { Box, TextField } from '@mui/material';
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

    setPageSize = e => {
        const pageSize = parseInt(e.target.value, 10);
        this.props.onChange({
            ...this.props.args,
            params: {
                maxSize: pageSize,
            },
            pageSize: pageSize,
        });
    };

    render() {
        const {
            p: polyglot,
            args: { pageSize, columnsCount, columnsParameters },
        } = this.props;
        return (
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
            >
                <TextField
                    label={polyglot.t('items_per_page')}
                    onChange={this.setPageSize}
                    value={pageSize}
                    type="number"
                    fullWidth
                />
                <TableColumnsParameters
                    onChange={this.setColumnParameter}
                    polyglot={polyglot}
                    parameterCount={columnsCount}
                    parameters={columnsParameters}
                />
            </Box>
        );
    }
}

export default translate(PaginatedTableAdmin);
