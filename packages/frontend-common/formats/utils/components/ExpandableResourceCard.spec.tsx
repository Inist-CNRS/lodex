import { MemoryRouter } from 'react-router-dom';
// @ts-expect-error TS7016
import { StyleSheetServer, StyleSheetTestUtils } from 'aphrodite';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpandableResourceCard from './ExpandableResourceCard';

const setup = (
    props: Partial<Parameters<typeof ExpandableResourceCard>[0]> = {},
) =>
    render(
        <MemoryRouter>
            <ExpandableResourceCard
                to="/uid:/1"
                title="T"
                description="D"
                {...props}
            />
        </MemoryRouter>,
    );

describe('ExpandableResourceCard', () => {
    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('renders the link as root with the search classes', () => {
        const { container } = setup();
        const link = container.firstChild as HTMLElement;
        expect(link.tagName).toBe('A');
        expect(link).toHaveClass('search-result-link');
        expect(link.firstChild).toHaveClass('search-result');
        expect(screen.getByText('T')).toHaveClass('search-result-title');
        expect(screen.getByText('D')).toHaveClass('search-result-description');
    });

    it('expands on the arrow without calling onClick', async () => {
        const onClick = jest.fn();
        setup({ onClick });
        const arrow = screen.getByRole('button', { expanded: false });
        await userEvent.click(arrow);
        expect(
            screen.getByRole('button', { expanded: true }),
        ).toBeInTheDocument();
        expect(onClick).not.toHaveBeenCalled();
    });

    it('calls onClick when the card is clicked', async () => {
        const onClick = jest.fn();
        setup({ onClick });
        await userEvent.click(screen.getByText('T'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('passes expanded to the slots', async () => {
        setup({
            afterDescription: (expanded) => (
                <span>{expanded ? 'open' : 'closed'}</span>
            ),
        });
        expect(screen.getByText('closed')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByText('open')).toBeInTheDocument();
    });

    it('opens in a new tab', () => {
        const { container } = setup({
            to: undefined,
            href: 'http://x',
            target: '_blank',
        });
        const link = container.firstChild as HTMLElement;
        expect(link).toHaveAttribute('href', 'http://x');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders no title or description box when they are missing', () => {
        const { container } = setup({
            title: undefined,
            description: undefined,
        });
        expect(
            container.querySelector('.search-result-title'),
        ).not.toBeInTheDocument();
        expect(
            container.querySelector('.search-result-description'),
        ).not.toBeInTheDocument();
    });

    it('highlights a visited link with the visited color only', () => {
        const { css } = StyleSheetServer.renderStatic(() =>
            setup({ visited: true }),
        );

        const link = screen.getByRole('link');
        expect(link).toHaveClass('search-result-link');
        expect(link).toHaveClass('search-result-activeLink');
        expect(css.content).toMatch(/\.activeLink_\w+\{/);
        expect(css.content).not.toContain('color:black !important');
    });

    it('does not highlight a link that was not visited', () => {
        setup();
        expect(screen.getByRole('link')).not.toHaveClass(
            'search-result-activeLink',
        );
    });
});
