import { TestI18N } from '../i18n/I18NContext';
import { CreateAnnotationTitle } from './CreateAnnotationTitle';
import { useForm } from '@tanstack/react-form';
import { render } from '../../../test-utils';
import { COMMENT_STEP, TARGET_STEP } from './steps';

interface TestTitleProps {
    formTarget?: string;
    step: string;
    fieldLabel?: string;
}

function TestTitle({ formTarget, ...props }: TestTitleProps) {
    const form = useForm({
        defaultValues: {
            target: formTarget,
        },
    });
    return (
        <TestI18N>
            <CreateAnnotationTitle
                form={form}
                // @ts-expect-error TS2322
                initialValue="initial value"
                goToStep={() => {}}
                {...props}
            />
        </TestI18N>
    );
}

describe('CreateAnnotationTitle', () => {
    it('should render annotate field title with no label when step is TARGET_STEP', async () => {
        const screen = render(<TestTitle step={TARGET_STEP} />);
        expect(
            screen.queryByText(
                'annotation_title_annotate_field_no_field_label',
            ),
        ).toBeInTheDocument();
    });
    it('should render annotate field title with no label when step is TARGET_STEP', async () => {
        const screen = render(
            <TestTitle step={TARGET_STEP} fieldLabel="Field Label" />,
        );
        expect(
            screen.queryByText(
                'annotation_title_annotate_field+{"field":"Field Label"}',
            ),
        ).toBeInTheDocument();
    });
    it('should render annotate field title with no label when target is title', async () => {
        const screen = render(
            <TestTitle step={COMMENT_STEP} formTarget="title" />,
        );
        expect(
            screen.queryByText(
                'annotation_title_annotate_field_no_field_label',
            ),
        ).toBeInTheDocument();
    });
    it('should render annotate field title with no label when step is TARGET_STEP', async () => {
        const screen = render(
            <TestTitle
                step={COMMENT_STEP}
                formTarget="title"
                fieldLabel="Field Label"
            />,
        );
        expect(
            screen.queryByText(
                'annotation_title_annotate_field+{"field":"Field Label"}',
            ),
        ).toBeInTheDocument();
    });

    it('should render annotate content title with no label when step is not TARGET_STEP', async () => {
        const screen = render(<TestTitle step={COMMENT_STEP} />);
        expect(
            screen.queryByText(
                'annotation_title_annotate_content_no_field_label',
            ),
        ).toBeInTheDocument();
    });

    it('should render annotate content title with label when step is not TARGET_STEP', async () => {
        const screen = render(
            <TestTitle step={COMMENT_STEP} fieldLabel="Field Label" />,
        );
        expect(
            screen.queryByText(
                'annotation_title_annotate_content+{"field":"Field Label"}',
            ),
        ).toBeInTheDocument();
    });
});
