import { MemoryRouter } from 'react-router';
// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestI18N } from '../../../i18n/I18NContext';
import { ResourcesGridView } from './ResourcesGridView';

const makeItems = (count: number, withSimilarity: boolean) =>
    Array.from({ length: count }, (_, i) => ({
        id: `uid:/${i}`,
        url: `http://localhost/uid:/${i}`,
        title: `title ${i}`,
        summary: `summary ${i}`,
        ...(withSimilarity ? { similarity: 0.9 - i / 100 } : {}),
    }));

const setup = (props: Partial<Parameters<typeof ResourcesGridView>[0]>) => {
    const filterFormatData = jest.fn();
    render(
        <TestI18N locale="fr">
            <MemoryRouter>
                <ResourcesGridView
                    field={{}}
                    data={[]}
                    total={0}
                    pageSize={3}
                    titleSize={-1}
                    summarySize={-1}
                    openInNewTab={false}
                    spaceWidth="30%"
                    allowToLoadMore={false}
                    filterFormatData={filterFormatData}
                    {...props}
                />
            </MemoryRouter>
        </TestI18N>,
    );
    return filterFormatData;
};

const cards = () => screen.queryAllByText(/^title \d+$/);

describe('ResourcesGridView', () => {
    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    describe('similarity mode', () => {
        it('paginates locally and never calls filterFormatData', async () => {
            const filterFormatData = setup({
                data: makeItems(7, true),
                total: 7,
            });

            expect(cards()).toHaveLength(3);
            expect(
                screen.getByText('see_more_result_count', { exact: false })
                    .textContent,
            ).toContain('"shown":3,"total":7');

            await userEvent.click(screen.getByRole('button'));
            expect(cards()).toHaveLength(6);
            expect(screen.getByRole('button').textContent).toContain(
                '"shown":6,"total":7',
            );

            await userEvent.click(screen.getByRole('button'));
            expect(cards()).toHaveLength(7);
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
            expect(filterFormatData).not.toHaveBeenCalled();
        });

        it('never gets stuck when total exceeds the received data', async () => {
            setup({ data: makeItems(4, true), total: 10 });

            expect(cards()).toHaveLength(3);
            expect(screen.getByRole('button').textContent).toContain(
                '"shown":3,"total":4',
            );
            await userEvent.click(screen.getByRole('button'));
            expect(cards()).toHaveLength(4);
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });

        it.each([
            [
                'shows the sentence when enabled and defined',
                true,
                { minSimilarity: 0.5 },
                '0,50',
            ],
            ['hides the sentence without minSimilarity', true, {}, undefined],
            [
                'hides the sentence without showMinSimilarity',
                undefined,
                { minSimilarity: 0.5 },
                undefined,
            ],
        ])('%s', (_name, showMinSimilarity, params, expected) => {
            setup({
                data: makeItems(2, true),
                total: 2,
                showMinSimilarity,
                params,
            });
            const sentence = screen.queryByText(/min_similarity_sentence/);
            if (expected === undefined) {
                expect(sentence).not.toBeInTheDocument();
            } else {
                expect(sentence?.querySelector('strong')?.textContent).toBe(
                    expected,
                );
            }
        });

        it('shows the default page size when pageSize is invalid', () => {
            setup({
                data: makeItems(10, true),
                total: 10,
                pageSize: null as unknown as number,
            });
            expect(cards()).toHaveLength(6);
        });

        it('shows the formatted similarity degree of each item', () => {
            setup({ data: makeItems(2, true), total: 2 });
            const degrees = screen.getAllByText(/similarity_degree/);
            expect(degrees).toHaveLength(2);
            expect(degrees[0].textContent).toContain('0,90');
        });
    });

    describe('classic mode', () => {
        it('shows no similarity degree', () => {
            setup({ data: makeItems(2, false), total: 2 });
            expect(
                screen.queryByText(/similarity_degree/),
            ).not.toBeInTheDocument();
        });

        it('loads the default page size when pageSize is invalid', async () => {
            const filterFormatData = setup({
                data: makeItems(10, false),
                total: 10,
                allowToLoadMore: true,
                pageSize: null as unknown as number,
            });
            expect(cards()).toHaveLength(6);

            await userEvent.click(screen.getByRole('button'));
            expect(filterFormatData).toHaveBeenCalledWith({ maxSize: 12 });
        });

        it('keeps the current load more behaviour', async () => {
            const filterFormatData = setup({
                data: makeItems(10, false),
                total: 10,
                allowToLoadMore: true,
            });
            expect(cards()).toHaveLength(3);
            const button = screen.getByRole('button');
            expect(button.textContent).toBe('see_more_result');

            await userEvent.click(button);
            expect(filterFormatData).toHaveBeenCalledWith({ maxSize: 6 });
        });
    });
});
