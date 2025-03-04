import React from 'react';
import { TestI18N } from '../i18n/I18NContext';
import { CreateAnnotationTitle } from './CreateAnnotationTitle';
import { useForm } from '@tanstack/react-form';
import { render } from '../../../test-utils';
import { COMMENT_STEP, TARGET_STEP } from './steps';
import PropTypes from 'prop-types';

function TestTitle({ formTarget, ...props }) {
    const form = useForm({
        defaultValues: {
            target: formTarget,
        },
    });
    return (
        <TestI18N>
            <CreateAnnotationTitle
                form={form}
                initialValue="initial value"
                goToStep={() => {}}
                {...props}
            />
        </TestI18N>
    );
}

TestTitle.propTypes = {
    formTarget: PropTypes.string,
};

describe('CreateAnnotationTitle', () => {
    it('should render annotate field title with no label when step is TARGET_STEP', async () => {
        const wrapper = render(<TestTitle step={TARGET_STEP} />);
        expect(
            wrapper.queryByText(
                'annotation_title_annotate_field_no_field_label',
            ),
        ).toBeInTheDocument();
    });
    it('should render annotate field title with no label when step is TARGET_STEP', async () => {
        const wrapper = render(
            <TestTitle step={TARGET_STEP} fieldLabel="Field Label" />,
        );
        expect(
            wrapper.queryByText(
                'annotation_title_annotate_field+{"field":"Field Label"}',
            ),
        ).toBeInTheDocument();
    });
    it('should render annotate field title with no label when target is title', async () => {
        const wrapper = render(
            <TestTitle step={COMMENT_STEP} formTarget="title" />,
        );
        expect(
            wrapper.queryByText(
                'annotation_title_annotate_field_no_field_label',
            ),
        ).toBeInTheDocument();
    });
    it('should render annotate field title with no label when step is TARGET_STEP', async () => {
        const wrapper = render(
            <TestTitle
                step={COMMENT_STEP}
                formTarget="title"
                fieldLabel="Field Label"
            />,
        );
        expect(
            wrapper.queryByText(
                'annotation_title_annotate_field+{"field":"Field Label"}',
            ),
        ).toBeInTheDocument();
    });

    it('should render annotate content title with no label when step is not TARGET_STEP', async () => {
        const wrapper = render(<TestTitle step={COMMENT_STEP} />);
        expect(
            wrapper.queryByText(
                'annotation_title_annotate_content_no_field_label',
            ),
        ).toBeInTheDocument();
    });

    it('should render annotate content title with label when step is not TARGET_STEP', async () => {
        const wrapper = render(
            <TestTitle step={COMMENT_STEP} fieldLabel="Field Label" />,
        );
        expect(
            wrapper.queryByText(
                'annotation_title_annotate_content+{"field":"Field Label"}',
            ),
        ).toBeInTheDocument();
    });
});
