import { MenuItem, TextField } from '@mui/material';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { fromParsing } from '../../selectors';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface SelectDatasetFieldComponentProps {
    datasetFields: string[];
    handleChange(...args: unknown[]): unknown;
    p: unknown;
    column?: string;
    label: string;
    id?: string;
}

export const SelectDatasetFieldComponent = ({
    datasetFields,
    handleChange,
    column = '',
    label,
    id = 'select_column',
}: SelectDatasetFieldComponentProps) => {
    const { translate } = useTranslate();
    return (
        <TextField
            select
            fullWidth
            id={id}
            onChange={(e) => handleChange(e.target.value)}
            label={translate(label)}
            value={column}
        >
            {datasetFields.map((datasetField) => (
                <MenuItem
                    key={`id_${datasetField}`}
                    className={`column-${datasetField.replaceAll(' ', '-')}`}
                    value={datasetField}
                >
                    {datasetField}
                </MenuItem>
            ))}
        </TextField>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
});

export default compose(
    connect(mapStateToProps),
    // @ts-expect-error TS2345
)(SelectDatasetFieldComponent);
