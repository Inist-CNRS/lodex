import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestI18N } from '../../../i18n/I18NContext';
import ResourcesAccordionAdmin, {
    defaultArgs,
} from './ResourcesAccordionAdmin';
import { precomputed } from '../resources-common/testFixtures';

const similar = precomputed('/api/run/vsimilar-precomputed/');
const other = precomputed('/api/run/vsearch-precomputed/');

const Wrapper = ({
    transformers,
    children,
}: {
    transformers: unknown;
    children: React.ReactNode;
}) => {
    const methods = useForm({ defaultValues: { transformers } });
    return <FormProvider {...methods}>{children}</FormProvider>;
};

const setup = (transformers?: unknown) => {
    const onChange = jest.fn();
    const ui = (
        <TestI18N>
            <ResourcesAccordionAdmin args={defaultArgs} onChange={onChange} />
        </TestI18N>
    );
    render(
        transformers ? <Wrapper transformers={transformers}>{ui}</Wrapper> : ui,
    );
    return onChange;
};

describe('ResourcesAccordionAdmin', () => {
    it('shows the similarity section and hides load more for vsimilar-precomputed', () => {
        setup(similar);
        expect(
            screen.getByLabelText('similar_max_resources'),
        ).toBeInTheDocument();
        expect(
            screen.queryByLabelText('allow_to_load_more'),
        ).not.toBeInTheDocument();
    });

    it('shows load more and no similarity section for another routine', () => {
        setup(other);
        expect(screen.getByLabelText('allow_to_load_more')).toBeInTheDocument();
        expect(
            screen.queryByLabelText('similar_max_resources'),
        ).not.toBeInTheDocument();
    });

    it('has no width, title size or summary size settings', () => {
        setup(other);
        for (const label of [
            'list_format_select_image_width',
            'number_of_char_title',
            'number_of_char_summary',
        ]) {
            expect(screen.queryByLabelText(label)).not.toBeInTheDocument();
        }
    });

    it('stores items per page in pageSize and params.maxSize', () => {
        const onChange = setup(other);
        fireEvent.change(screen.getByLabelText('items_per_page'), {
            target: { value: '9' },
        });
        expect(onChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                pageSize: 9,
                params: expect.objectContaining({ maxSize: 9 }),
            }),
        );
    });

    it('stores open in new tab', async () => {
        const onChange = setup(other);
        await userEvent.click(screen.getByLabelText('open_in_new_tab'));
        expect(onChange).toHaveBeenLastCalledWith(
            expect.objectContaining({ openInNewTab: true }),
        );
    });
});
