import AbstractTableAdmin from '../core/AbstractTableAdmin';
import { translate } from '../../../../i18n/I18NContext';
import RoutineParamsAdmin from '../../../utils/components/admin/RoutineParamsAdmin';
import TableColumnsParameters from '../core/TableColumnsParameters';
// @ts-expect-error TS6133
import React from 'react';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';

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
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
            args: { params, columnsCount, columnsParameters },
        } = this.props;
        return (
            <FormatGroupedFieldSet>
                <FormatDataParamsFieldSet>
                    <RoutineParamsAdmin
                        params={params || defaultArgs.params}
                        onChange={this.handleParams}
                        polyglot={polyglot}
                        showMaxSize={true}
                        showMaxValue={true}
                        showMinValue={true}
                        showOrderBy={true}
                    />
                </FormatDataParamsFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
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

export default translate(UnPaginatedTableAdmin);
