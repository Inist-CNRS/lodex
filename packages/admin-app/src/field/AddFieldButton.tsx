import { Button } from '@mui/material';
import { Add as AddNewIcon } from '@mui/icons-material';
import { connect } from 'react-redux';
import { useParams } from 'react-router';

import { addField } from '../../../../src/app/js/fields/reducer';
import { fromFields } from '../../../../src/app/js/sharedSelectors';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface AddFieldButtonComponentProps {
    onAddNewField(...args: unknown[]): unknown;
    isFieldsLoading?: boolean;
}

export const AddFieldButtonComponent = ({
    onAddNewField,
    isFieldsLoading,
}: AddFieldButtonComponentProps) => {
    const { translate } = useTranslate();
    // @ts-expect-error TS2339
    const { filter } = useParams();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
                onAddNewField({ scope: filter });
            }}
            disabled={isFieldsLoading}
            startIcon={<AddNewIcon />}
        >
            {translate('new_field')}
        </Button>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    isFieldsLoading: fromFields.isLoading(state),
});

const mapDispatchToProps = {
    onAddNewField: addField,
};

export const AddFieldButton = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AddFieldButtonComponent);
