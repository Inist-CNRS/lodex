import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestI18N } from '../../../i18n/I18NContext';
import ResourcesGridAdmin, { defaultArgs } from './ResourcesGridAdmin';
import { precomputed } from './testFixtures';

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

const setup = (transformers?: unknown, args: Args = defaultArgs) => {
    const onChange = jest.fn();
    const ui = (
        <TestI18N>
            <ResourcesGridAdmin args={args} onChange={onChange} />
        </TestI18N>
    );
    render(
        transformers ? <Wrapper transformers={transformers}>{ui}</Wrapper> : ui,
    );
    return onChange;
};

type Args = Parameters<typeof ResourcesGridAdmin>[0]['args'];

const similarAdmin = (args: Args) => (
    <TestI18N>
        <Wrapper transformers={similar}>
            <ResourcesGridAdmin args={args} onChange={jest.fn()} />
        </Wrapper>
    </TestI18N>
);

describe('ResourcesGridAdmin', () => {
    it('shows the similarity section for vsimilar-precomputed', () => {
        setup(similar);
        expect(
            screen.getByLabelText('similar_max_resources'),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText('similar_min_similarity'),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText('similar_show_min_similarity'),
        ).toBeInTheDocument();
        expect(
            screen.queryByLabelText('allow_to_load_more'),
        ).not.toBeInTheDocument();
    });

    it('hides the similarity section for another routine', () => {
        setup(other);
        expect(
            screen.queryByLabelText('similar_max_resources'),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByLabelText('similar_min_similarity'),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByLabelText('similar_show_min_similarity'),
        ).not.toBeInTheDocument();
        expect(screen.getByLabelText('allow_to_load_more')).toBeInTheDocument();
    });

    it('renders without form context', () => {
        setup();
        expect(
            screen.queryByLabelText('similar_max_resources'),
        ).not.toBeInTheDocument();
        expect(screen.getByLabelText('allow_to_load_more')).toBeInTheDocument();
    });

    it('stores the settings in args', async () => {
        const user = userEvent.setup();
        const onChange = setup(similar);

        await user.type(screen.getByLabelText('similar_max_resources'), '7');
        expect(onChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                params: expect.objectContaining({
                    maxResources: 7,
                    maxSize: defaultArgs.params.maxSize,
                }),
            }),
        );

        await user.type(screen.getByLabelText('similar_min_similarity'), '0,5');
        expect(onChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                params: expect.objectContaining({ minSimilarity: 0.5 }),
            }),
        );

        await user.click(screen.getByLabelText('similar_show_min_similarity'));
        expect(onChange).toHaveBeenLastCalledWith(
            expect.objectContaining({ showMinSimilarity: true }),
        );
    });

    it.each(['', '1.5', 'abc'])(
        'removes the minimum when the input is %p',
        (text) => {
            const onChange = setup(similar, {
                ...defaultArgs,
                params: { ...defaultArgs.params, minSimilarity: 0.5 },
            });
            const input = screen.getByLabelText('similar_min_similarity');

            fireEvent.change(input, { target: { value: text } });

            const { params } = onChange.mock.calls.at(-1)[0];
            expect(params).not.toHaveProperty('minSimilarity');
            expect(params).toHaveProperty('maxSize', 5);
        },
    );

    it('shows the new minimum when args change from outside', () => {
        const args = {
            ...defaultArgs,
            params: { ...defaultArgs.params, minSimilarity: 0.5 },
        };
        const { rerender } = render(similarAdmin(args));
        const input = screen.getByLabelText('similar_min_similarity');
        expect(input).toHaveValue('0.5');

        rerender(
            similarAdmin({
                ...args,
                params: { ...defaultArgs.params, minSimilarity: 0.3 },
            }),
        );
        expect(input).toHaveValue('0.3');

        rerender(similarAdmin({ ...args, params: defaultArgs.params }));
        expect(input).toHaveValue('');
    });

    it('keeps the typed text while it matches the stored minimum', () => {
        const args = {
            ...defaultArgs,
            params: { ...defaultArgs.params, minSimilarity: 0 },
        };
        const { rerender } = render(
            similarAdmin({ ...args, params: defaultArgs.params }),
        );
        const input = screen.getByLabelText('similar_min_similarity');

        fireEvent.change(input, { target: { value: '0,' } });
        rerender(similarAdmin(args));
        expect(input).toHaveValue('0,');
    });

    it('does not store a maxResources below 1', () => {
        const onChange = setup(similar, {
            ...defaultArgs,
            params: { ...defaultArgs.params, maxResources: 5 },
        });
        const input = screen.getByLabelText('similar_max_resources');

        fireEvent.change(input, { target: { value: '0' } });
        const last = onChange.mock.calls.at(-1)[0];
        expect(last.params).not.toHaveProperty('maxResources');
    });

    it('keeps pageSize copied into maxSize', () => {
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
});
