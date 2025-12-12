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

    it('should not render when captions is empty array', () => {
        render(<NetworkCaption captions={[]} />);

        expect(
            screen.queryByRole('button', { name: /caption/i }),
        ).not.toBeInTheDocument();
    });

    it('should render accordion with default caption title', () => {
        const captions = [{ label: 'Red Items', color: '#FF0000' }];

        render(<NetworkCaption captions={captions} />);

        expect(
            screen.getByRole('button', { name: 'caption' }),
        ).toBeInTheDocument();
    });

    it('should render accordion with custom caption title', () => {
        const captions = [{ label: 'Red Items', color: '#FF0000' }];

        render(
            <NetworkCaption captions={captions} captionTitle="Custom Legend" />,
        );

        expect(
            screen.getByRole('button', { name: 'Custom Legend' }),
        ).toBeInTheDocument();
    });

    it('should render caption list when accordion is expanded', async () => {
        const user = userEvent.setup();
        const captions = [
            { label: 'Red Items', color: '#FF0000' },
            { label: 'Green Items', color: '#00FF00' },
            { label: 'Blue Items', color: '#0000FF' },
        ];

        render(<NetworkCaption captions={captions} />);

        const accordionButton = screen.getByRole('button', { name: 'caption' });
        await user.click(accordionButton);

        expect(screen.getByText('Red Items')).toBeInTheDocument();
        expect(screen.getByText('Blue Items')).toBeInTheDocument();
        expect(screen.getByText('Green Items')).toBeInTheDocument();
    });

    it('should render color boxes with correct background colors', async () => {
        const user = userEvent.setup();
        const captions = [
            { label: 'Red Items', color: '#FF0000' },
            { label: 'Blue Items', color: '#0000FF' },
        ];

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

    it('should render multiple caption items in correct order', async () => {
        const user = userEvent.setup();
        const captions = [
            { label: 'First', color: '#FF0000' },
            { label: 'Second', color: '#00FF00' },
            { label: 'Third', color: '#0000FF' },
            { label: 'Fourth', color: '#FFFF00' },
        ];

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
        const captions = [
            {
                label: 'Red Items',
                color: '#FF0000',
            },
        ];

        render(<NetworkCaption captions={captions} />);

        const accordionButton = screen.getByRole('button', { name: 'caption' });
        expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should expand and collapse on click', async () => {
        const user = userEvent.setup();
        const captions = [
            {
                label: 'Red Items',
                color: '#FF0000',
            },
        ];

        render(<NetworkCaption captions={captions} />);

        const accordionButton = screen.getByRole('button', { name: 'caption' });

        expect(accordionButton).toHaveAttribute('aria-expanded', 'false');

        await user.click(accordionButton);
        expect(accordionButton).toHaveAttribute('aria-expanded', 'true');

        await user.click(accordionButton);
        expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
    });
});
