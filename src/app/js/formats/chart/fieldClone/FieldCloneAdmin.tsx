import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { useParams } from 'react-router';

import { MenuItem, TextField } from '@mui/material';
import { fromFields } from '../../../sharedSelectors';
import {
    SCOPE_DATASET,
    SCOPE_GRAPHIC,
    SCOPE_DOCUMENT,
    SCOPE_COLLECTION,
} from '../../../../../common/scope';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '../../../i18n/I18NContext';

export const defaultArgs = {
    value: '',
};

// @ts-expect-error TS7006
export const isValidClonableField = (field, filter) => {
    if (field.format && field.format.name === 'fieldClone') {
        return false;
    }

    if (
        (filter === SCOPE_DATASET || filter === SCOPE_GRAPHIC) &&
        field.scope !== SCOPE_DATASET &&
        field.scope !== SCOPE_GRAPHIC
    ) {
        return false;
    }

    if (
        (filter === SCOPE_DOCUMENT || filter === SCOPE_COLLECTION) &&
        field.scope !== SCOPE_DOCUMENT &&
        field.scope !== SCOPE_COLLECTION
    ) {
        return false;
    }
    return true;
};

interface FieldCloneAdminProps {
    args: {
        value?: string;
    };
    onChange(...args: unknown[]): unknown;
    fields: {
        name: string;
        label: string;
    }[];
}

const FieldCloneAdmin = ({
    args = defaultArgs,
    onChange,
    fields = [],
}: FieldCloneAdminProps) => {
    const { translate } = useTranslate();
    // @ts-expect-error TS2339
    const { filter } = useParams();
    // @ts-expect-error TS7006
    const handleValue = (e) => {
        const newArgs = { value: e.target.value };
        onChange(newArgs);
    };

    const filteredFields = fields.filter((f) =>
        isValidClonableField(f, filter),
    );

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    onChange={handleValue}
                    value={args.value}
                    label={translate('fieldclone_format_value')}
                >
                    {filteredFields.map((field) => {
                        return (
                            <MenuItem value={field.name} key={field.name}>
                                {field.name} - {field.label}
                            </MenuItem>
                        );
                    })}
                </TextField>
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    fields: fromFields.getFields(state),
});

// @ts-expect-error TS2345
export default compose(connect(mapStateToProps))(FieldCloneAdmin);
