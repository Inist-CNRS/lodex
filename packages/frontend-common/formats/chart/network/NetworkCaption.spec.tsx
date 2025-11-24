import { screen, within } from '@testing-library/react';
import { render, userEvent } from '../../../test-utils';
import { NetworkCaption } from './NetworkCaption';

describe('NetworkCaption', () => {
    it('should not render when captions is undefined', () => {
        render(<NetworkCaption captions={undefined} />);

        expect(
            screen.queryByRole('button', { name: /caption/i }),
        ).not.toBeInTheDocument();
    });

    it('should not render when captions is empty object', () => {
        render(<NetworkCaption captions={{}} />);

        expect(
            screen.queryByRole('button', { name: /caption/i }),
        ).not.toBeInTheDocument();
    });

    it('should render accordion with default caption title', () => {
        const captions = {
            'Red Items': '#FF0000',
        };

        render(<NetworkCaption captions={captions} />);

        expect(
            screen.getByRole('button', { name: 'caption' }),
        ).toBeInTheDocument();
    });

    it('should render accordion with custom caption title', () => {
        const captions = {
            'Red Items': '#FF0000',
        };

        render(
            <NetworkCaption captions={captions} captionTitle="Custom Legend" />,
        );

        expect(
            screen.getByRole('button', { name: 'Custom Legend' }),
        ).toBeInTheDocument();
    });

    it('should render caption list when accordion is expanded', async () => {
        const user = userEvent.setup();
        const captions = {
            'Red Items': '#FF0000',
            'Blue Items': '#0000FF',
            'Green Items': '#00FF00',
        };

        render(<NetworkCaption captions={captions} />);

        const accordionButton = screen.getByRole('button', { name: 'caption' });
        await user.click(accordionButton);

        expect(screen.getByText('Red Items')).toBeInTheDocument();
        expect(screen.getByText('Blue Items')).toBeInTheDocument();
        expect(screen.getByText('Green Items')).toBeInTheDocument();
    });

    it('should render color boxes with correct background colors', async () => {
        const user = userEvent.setup();
        const captions = {
            'Red Items': '#FF0000',
            'Blue Items': '#0000FF',
        };

        render(<NetworkCaption captions={captions} />);

        const accordionButton = screen.getByRole('button', { name: 'caption' });
        await user.click(accordionButton);

        const accordionDetails = screen.getByRole('region', {
            name: 'caption',
        });

        const redBox =
            within(accordionDetails).getByText(
                'Red Items',
            ).previousElementSibling;
        const blueBox =
            within(accordionDetails).getByText(
                'Blue Items',
            ).previousElementSibling;

        expect(redBox).toHaveStyle({ backgroundColor: '#FF0000' });
        expect(blueBox).toHaveStyle({ backgroundColor: '#0000FF' });
    });

    it('should trim whitespace from captions and colors', async () => {
        const user = userEvent.setup();
        const captions = {
            '  Red Items  ': '  #FF0000  ',
            '  Blue Items  ': '  #0000FF  ',
        };

        render(<NetworkCaption captions={captions} />);

        const accordionButton = screen.getByRole('button', { name: 'caption' });
        await user.click(accordionButton);

        expect(screen.getByText('Red Items')).toBeInTheDocument();
        expect(screen.getByText('Blue Items')).toBeInTheDocument();
    });

    it.each<{
        label: string;
        captions: Record<string, string>;
        expectedVisible: string[];
        expectedHidden: string[];
    }>([
        {
            label: 'empty caption string',
            captions: { '': '#FF0000', Valid: '#00FF00' },
            expectedVisible: ['Valid'],
            expectedHidden: [''],
        },
        {
            label: 'whitespace-only caption',
            captions: { '   ': '#FF0000', Valid: '#00FF00' },
            expectedVisible: ['Valid'],
            expectedHidden: [],
        },
        {
            label: 'empty color string',
            captions: { 'Red Items': '', Valid: '#00FF00' },
            expectedVisible: ['Valid'],
            expectedHidden: ['Red Items'],
        },
        {
            label: 'whitespace-only color',
            captions: { 'Red Items': '   ', Valid: '#00FF00' },
            expectedVisible: ['Valid'],
            expectedHidden: ['Red Items'],
        },
    ])(
        'should filter out entries with $label',
        async ({ captions, expectedVisible, expectedHidden }) => {
            const user = userEvent.setup();

            render(<NetworkCaption captions={captions} />);

            const accordionButton = screen.getByRole('button', {
                name: 'caption',
            });
            await user.click(accordionButton);

            for (const text of expectedVisible) {
                expect(screen.getByText(text)).toBeInTheDocument();
            }

            for (const text of expectedHidden) {
                if (text) {
                    expect(screen.queryByText(text)).not.toBeInTheDocument();
                }
            }
        },
    );

    it('should not render when all captions are invalid', () => {
        const captions = {
            '': '#FF0000',
            '   ': '#00FF00',
            'Red Items': '',
            'Blue Items': '   ',
        };

        render(<NetworkCaption captions={captions} />);

        expect(
            screen.queryByRole('button', { name: /caption/i }),
        ).not.toBeInTheDocument();
    });

    it('should render multiple caption items in correct order', async () => {
        const user = userEvent.setup();
        const captions = {
            First: '#FF0000',
            Second: '#00FF00',
            Third: '#0000FF',
        };

        render(<NetworkCaption captions={captions} />);

        const accordionButton = screen.getByRole('button', { name: 'caption' });
        await user.click(accordionButton);

        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
        expect(screen.getByText('Third')).toBeInTheDocument();

        const accordionDetails = screen.getByRole('region', {
            name: 'caption',
        });
        const allText = accordionDetails.textContent;

        expect(allText?.indexOf('First')).toBeLessThan(
            allText?.indexOf('Second') ?? 0,
        );
        expect(allText?.indexOf('Second')).toBeLessThan(
            allText?.indexOf('Third') ?? 0,
        );
    });

    it('should start in collapsed state', () => {
        const captions = {
            'Red Items': '#FF0000',
        };

        render(<NetworkCaption captions={captions} />);

        const accordionButton = screen.getByRole('button', { name: 'caption' });
        expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should expand and collapse on click', async () => {
        const user = userEvent.setup();
        const captions = {
            'Red Items': '#FF0000',
        };

        render(<NetworkCaption captions={captions} />);

        const accordionButton = screen.getByRole('button', { name: 'caption' });

        expect(accordionButton).toHaveAttribute('aria-expanded', 'false');

        await user.click(accordionButton);
        expect(accordionButton).toHaveAttribute('aria-expanded', 'true');

        await user.click(accordionButton);
        expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
    });
});
