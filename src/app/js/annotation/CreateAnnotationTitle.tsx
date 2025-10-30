import { Typography } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { TARGET_STEP, type Step } from './steps';
import { useStore } from '@tanstack/react-form';

interface CreateAnnotationTitleProps {
    fieldLabel?: string;
    step?: Step;
    form: object;
}

export const CreateAnnotationTitle = ({
    fieldLabel,
    step,
    form,
}: CreateAnnotationTitleProps) => {
    const { translate } = useTranslate();

    // @ts-expect-error TS2339
    const target = useStore(form.store, (state) => {
        // @ts-expect-error TS18046
        return state.values.target;
    });

    if (step === TARGET_STEP || target === 'title') {
        return (
            <Typography role="heading" variant="h6" color="text.gray">
                {fieldLabel
                    ? translate('annotation_title_annotate_field', {
                          field: fieldLabel,
                      })
                    : translate(
                          'annotation_title_annotate_field_no_field_label',
                      )}
            </Typography>
        );
    }

    return (
        <Typography role="heading" variant="h6" color="text.gray">
            {fieldLabel
                ? translate('annotation_title_annotate_content', {
                      field: fieldLabel,
                  })
                : translate('annotation_title_annotate_content_no_field_label')}
        </Typography>
    );
};
