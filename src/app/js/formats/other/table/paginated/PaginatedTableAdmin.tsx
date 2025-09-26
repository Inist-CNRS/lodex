import AbstractTableAdmin from '../core/AbstractTableAdmin';
import { TextField } from '@mui/material';
import TableColumnsParameters from '../core/TableColumnsParameters';
import React from 'react';
import { FormatDefaultParamsFieldSet } from '../../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';
import { translate } from '../../../../i18n/I18NContext';

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
    static propTypes = AbstractTableAdmin.propTypes;

    static defaultProps = {
        args: defaultArgs,
    };

    // @ts-expect-error TS7006
    handlePageSize = (e) => {
        const pageSize = parseInt(e.target.value, 10);
        // @ts-expect-error TS2339
        this.props.onChange({
            // @ts-expect-error TS2339
            ...this.props.args,
            params: {
                maxSize: pageSize,
            },
            pageSize: pageSize,
        });
    };

    render() {
        const {
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
            args: { pageSize, columnsCount, columnsParameters },
        } = this.props;
        return (
            <FormatGroupedFieldSet>
                {/*
                 // @ts-expect-error TS2322 */}
                <FormatDefaultParamsFieldSet defaultExpanded>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <TextField
                        label={polyglot.t('items_per_page')}
                        onChange={this.handlePageSize}
                        value={pageSize}
                        type="number"
                        fullWidth
                    />
                    {/*
                     // @ts-expect-error TS2322 */}
                    <TableColumnsParameters
                        onChange={this.handleColumnParameter}
                        polyglot={polyglot}
                        parameterCount={columnsCount}
                        parameters={columnsParameters}
                    />
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(PaginatedTableAdmin);
