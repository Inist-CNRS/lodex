import { SearchPaneContext } from '../../../search/SearchPaneContext';
import { act, render, userEvent } from '../../../test-utils';
import { BubbleView } from './BubbleView';

const data = [
    { data: { _id: 'id1' }, r: 10, x: 10, y: 10, value: 1 },
    { data: { _id: 'id2' }, r: 20, x: 20, y: 20, value: 2 },
    { data: { _id: 'id3' }, r: 30, x: 30, y: 30, value: 3 },
];

const colors = '#1D1A31 #4D2D52 #9A4C95 #F08CAE #C1A5A9';

describe('BubbleView', () => {
    it('should render Bubble chart', () => {
        const screen = render(
            <BubbleView
                data={data}
                diameter={100}
                colorSet={colors.split(' ')}
            />,
        );

        // Check that all bubbles are rendered
        const bubbles = screen
            .getAllByRole('generic')
            .filter((el) => el.getAttribute('data-tip')?.includes(':'));
        expect(bubbles).toHaveLength(3);

        // Check bubble data attributes
        expect(bubbles[0]).toHaveAttribute('data-tip', 'id1: 1');
        expect(bubbles[1]).toHaveAttribute('data-tip', 'id2: 2');
        expect(bubbles[2]).toHaveAttribute('data-tip', 'id3: 3');

        // Check that bubble labels are rendered for bubbles with r > 10
        expect(screen.getByText('id2')).toBeInTheDocument();
        expect(screen.getByText('id3')).toBeInTheDocument();
        expect(screen.queryByText('id1')).not.toBeInTheDocument(); // r = 10, so no label
    });

    it('should not fail to render if the diameter is a string', () => {
        const screen = render(
            <BubbleView
                data={data}
                diameter={'100'}
                colorSet={colors.split(' ')}
            />,
        );

        // Check that all bubbles are rendered
        const bubbles = screen
            .getAllByRole('generic')
            .filter((el) => el.getAttribute('data-tip')?.includes(':'));
        expect(bubbles).toHaveLength(3);

        // Check bubble data attributes
        expect(bubbles[0]).toHaveAttribute('data-tip', 'id1: 1');
        expect(bubbles[1]).toHaveAttribute('data-tip', 'id2: 2');
        expect(bubbles[2]).toHaveAttribute('data-tip', 'id3: 3');
    });

    it('should apply correct styles to bubbles', () => {
        const screen = render(
            <BubbleView
                data={data}
                diameter={100}
                colorSet={colors.split(' ')}
            />,
        );

        const bubbles = screen
            .getAllByRole('generic')
            .filter((el) => el.getAttribute('data-tip')?.includes(':'));

        // Check that bubbles have the correct positioning styles
        expect(bubbles[0]).toHaveStyle({
            position: 'absolute',
            top: '0px', // x - r = 10 - 10 = 0
            left: '0px', // y - r = 10 - 10 = 0
            width: '20px', // r * 2 = 10 * 2 = 20
            height: '20px',
        });

        expect(bubbles[1]).toHaveStyle({
            position: 'absolute',
            top: '0px', // x - r = 20 - 20 = 0
            left: '0px', // y - r = 20 - 20 = 0
            width: '40px', // r * 2 = 20 * 2 = 40
            height: '40px',
        });
    });

    it('should allow to click on bubbles to set filter', async () => {
        const selectOne = jest.fn();
        const selectMany = jest.fn();

        const user = userEvent.setup();
        const screen = render(
            <SearchPaneContext.Provider
                value={{
                    selectOne,
                    selectMany,
                    clearFilters() {},
                    filters: [
                        {
                            fieldName: 'someField',
                            value: 'someValue',
                        },
                    ],
                }}
            >
                <BubbleView
                    data={data}
                    diameter={100}
                    colorSet={colors.split(' ')}
                    field={{
                        name: 'testField',
                        format: {
                            name: 'bubbleChart',
                            args: {
                                fieldToFilter: 'testFieldToFilter',
                            },
                        },
                        _id: 'fieldId',
                    }}
                />
            </SearchPaneContext.Provider>,
        );

        await act(() => user.click(screen.getByText('id2')));

        expect(selectOne).toHaveBeenCalledWith({
            fieldName: 'testFieldToFilter',
            value: 'id2',
        });

        expect(selectMany).not.toHaveBeenCalled();
    });

    it('should render empty chart when no data is provided', () => {
        const screen = render(
            <BubbleView
                data={[]}
                diameter={100}
                colorSet={colors.split(' ')}
            />,
        );

        const bubbles = screen
            .queryAllByRole('generic')
            .filter((el) => el.getAttribute('data-tip')?.includes(':'));
        expect(bubbles).toHaveLength(0);
    });
});
