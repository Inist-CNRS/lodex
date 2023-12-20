import AbstractTableAdmin from '../core/AbstractTableAdmin';
import translate from 'redux-polyglot/translate';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';
import TableColumnsParameters from '../core/TableColumnsParameters';
import React from 'react';
import { Box } from '@mui/material';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../../utils/components/FormatFieldSets';
import FormatGroupedFieldSet from '../../../utils/components/FormatGroupedFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 6,
        orderBy: 'value/asc',
    },
    columnsCount: 0,
    columnsParameters: [],
};

class UnPaginatedTableAdmin extends AbstractTableAdmin {
    static defaultProps = {
        args: defaultArgs,
    };

    render() {
        const {
            p: polyglot,
            args: { params, columnsCount, columnsParameters },
        } = this.props;
        return (
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet>
                    <RoutineParamsAdmin
                        params={params || defaultArgs.params}
                        onChange={this.setParams}
                        polyglot={polyglot}
                        showMaxSize={true}
                        showMaxValue={true}
                        showMinValue={true}
                        showOrderBy={true}
                    />
                </FormatDataParamsFieldSet>
                <FormatDefaultParamsFieldSet>
                    <TableColumnsParameters
                        onChange={this.setColumnParameter}
                        polyglot={polyglot}
                        parameterCount={columnsCount}
                        parameters={columnsParameters}
                    />
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(UnPaginatedTableAdmin);
