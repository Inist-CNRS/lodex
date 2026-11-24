import { MemoryRouter } from 'react-router';
// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestI18N } from '../../../i18n/I18NContext';
import {
    ResourcesAccordionFromFormatData,
    ResourcesAccordionView,
} from './ResourcesAccordionView';

type Item = Parameters<typeof ResourcesAccordionView>[0]['data'][number];

const makeItems = (count: number, withSimilarity: boolean): Item[] =>
    Array.from({ length: count }, (_, i) => ({
        id: `uid:/${i}`,
        url: `http://localhost/uid:/${i}`,
        title: `title ${i}`,
        summary: `summary ${i}`,
        ...(withSimilarity ? { similarity: 0.9 - i / 100 } : {}),
    }));

type Props = Parameters<typeof ResourcesAccordionView>[0];

const ui = (props: Partial<Props>) => (
    <TestI18N locale="fr">
        <MemoryRouter>
            <ResourcesAccordionView
                data={[]}
                total={0}
                pageSize={3}
                openInNewTab={false}
                allowToLoadMore={false}
                filterFormatData={jest.fn()}
                {...props}
            />
        </MemoryRouter>
    </TestI18N>
);

const setup = (props: Partial<Props>) => {
    const filterFormatData = jest.fn();
    const { rerender } = render(ui({ filterFormatData, ...props }));
    return Object.assign(filterFormatData, { rerender });
};

const titles = () => screen.queryAllByText(/^title \d+$/);

describe('ResourcesAccordionView', () => {
    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('paginates locally in similarity mode', async () => {
        const filterFormatData = setup({ data: makeItems(7, true), total: 7 });
        expect(titles()).toHaveLength(3);
        await userEvent.click(screen.getByText(/see_more_result_count/));
        expect(titles()).toHaveLength(6);
        expect(filterFormatData).not.toHaveBeenCalled();
    });

    it('reloads with a bigger maxSize otherwise', async () => {
        const filterFormatData = setup({
            data: makeItems(10, false),
            total: 10,
            allowToLoadMore: true,
        });
        await userEvent.click(screen.getByText('see_more_result'));
        expect(filterFormatData).toHaveBeenCalledWith({ maxSize: 6 });
    });

    it('shows the similarity degree', () => {
        setup({ data: makeItems(2, true), total: 2 });
        expect(screen.getAllByText(/similarity_degree/)).toHaveLength(2);
    });

    it('shows the minimum sentence only when asked and set', () => {
        setup({
            data: makeItems(2, true),
            total: 2,
            showMinSimilarity: true,
            params: { minSimilarity: 0.5 },
        });
        expect(screen.getByText(/min_similarity_sentence/)).toBeInTheDocument();
    });

    it('hides the minimum sentence when not asked', () => {
        setup({
            data: makeItems(2, true),
            total: 2,
            params: { minSimilarity: 0.5 },
        });
        expect(
            screen.queryByText(/min_similarity_sentence/),
        ).not.toBeInTheDocument();
    });

    it('falls back to 6 items for an invalid pageSize', () => {
        setup({
            data: makeItems(8, true),
            total: 8,
            pageSize: null as unknown as number,
        });
        expect(titles()).toHaveLength(6);
    });

    it('links an external resource to its url', () => {
        setup({
            data: [
                { id: 'https://ext/1', url: 'https://ext/1', title: 'title 1' },
            ],
            total: 1,
        });
        expect(screen.getByText('title 1').closest('a')).toHaveAttribute(
            'href',
            'https://ext/1',
        );
    });

    it('links a local resource to its page', () => {
        setup({ data: makeItems(1, false), total: 1 });
        expect(
            screen.getByText('title 0').closest('a')?.getAttribute('href'),
        ).toMatch(/\/uid:\/0$/);
    });

    it('skips items without id, shows n/a without title, no description without summary', () => {
        setup({
            data: [
                { title: 'title 9', summary: 'no id' },
                { id: 'uid:/1', summary: 'only summary' },
                { id: 'uid:/2', title: 'title 2' },
            ],
            total: 3,
        });
        expect(screen.queryByText('title 9')).not.toBeInTheDocument();
        expect(screen.getByText('n/a')).toBeInTheDocument();
        expect(screen.getByText('title 2')).toBeInTheDocument();
        expect(
            document.querySelectorAll('.search-result-description'),
        ).toHaveLength(1);
    });

    it('does not carry the unfolded state over to another resource', async () => {
        const { rerender } = setup({ data: makeItems(2, false), total: 2 });
        await userEvent.click(screen.getAllByRole('button')[0]);
        expect(screen.getAllByRole('button')[0]).toHaveAttribute(
            'aria-expanded',
            'true',
        );

        rerender(
            ui({
                data: [
                    { id: 'uid:/c', title: 'title C', summary: 'summary C' },
                    { id: 'uid:/d', title: 'title D', summary: 'summary D' },
                ],
                total: 2,
            }),
        );
        expect(screen.getAllByRole('button')[0]).toHaveAttribute(
            'aria-expanded',
            'false',
        );
    });

    it('shows a resource listed twice without a duplicate key', () => {
        const error = jest.spyOn(console, 'error').mockImplementation(() => {});
        const [item] = makeItems(1, false);
        setup({ data: [item, item], total: 2 });
        expect(titles()).toHaveLength(2);
        expect(error).not.toHaveBeenCalledWith(
            expect.stringContaining('same key'),
            expect.anything(),
        );
        error.mockRestore();
    });

    it('reads the items and the total from formatData', () => {
        render(
            <TestI18N locale="fr">
                <MemoryRouter>
                    <ResourcesAccordionFromFormatData
                        formatData={{ items: makeItems(2, false), total: 2 }}
                        pageSize={3}
                        openInNewTab={false}
                        allowToLoadMore={false}
                        filterFormatData={jest.fn()}
                    />
                </MemoryRouter>
            </TestI18N>,
        );
        expect(titles()).toHaveLength(2);
    });

    it('shows nothing when formatData has no items', () => {
        render(
            <TestI18N locale="fr">
                <MemoryRouter>
                    <ResourcesAccordionFromFormatData
                        formatData={null}
                        pageSize={3}
                        openInNewTab={false}
                        allowToLoadMore={false}
                        filterFormatData={jest.fn()}
                    />
                </MemoryRouter>
            </TestI18N>,
        );
        expect(titles()).toHaveLength(0);
    });

    it('opens in a new tab', () => {
        setup({ data: makeItems(1, false), total: 1, openInNewTab: true });
        expect(screen.getByText('title 0').closest('a')).toHaveAttribute(
            'target',
            '_blank',
        );
    });

    it('renders nothing but the list for empty data', () => {
        setup({});
        expect(screen.queryByText(/see_more_result/)).not.toBeInTheDocument();
        expect(
            document.querySelector('.resources-accordion-list'),
        ).not.toBeNull();
    });
});
