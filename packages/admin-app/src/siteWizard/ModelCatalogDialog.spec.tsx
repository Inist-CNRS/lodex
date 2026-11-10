import { render, userEvent } from '../test-utils';
import { screen } from '@testing-library/react';
import type { CatalogModel } from '@lodex/common';
import { ModelCatalogDialog } from './ModelCatalogDialog';

jest.mock('./hasTranslation', () => ({ hasTranslation: () => true }));

const models: CatalogModel[] = [
    { id: 'a', url: 'http://a.tar', loader: 'la', doc: 'http://doc-a' },
    { id: 'b', url: 'http://b.tar', loader: 'lb' },
];

const setup = () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    render(
        <ModelCatalogDialog
            isOpen
            models={models}
            selectedId="a"
            onSelect={onSelect}
            onClose={onClose}
        />,
    );
    return { onSelect, onClose };
};

describe('ModelCatalogDialog', () => {
    it('should render one item per model', () => {
        setup();
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(screen.getByText('mc_a_title')).toBeInTheDocument();
        expect(screen.getByText('mc_b_description')).toBeInTheDocument();
    });

    it('should render the doc link only when doc is defined', () => {
        setup();
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(1);
        expect(links[0]).toHaveAttribute('href', 'http://doc-a');
    });

    it('should call onSelect then onClose when clicking an item', async () => {
        const { onSelect, onClose } = setup();
        await userEvent.click(screen.getByText('mc_b_title'));
        expect(onSelect).toHaveBeenCalledWith('b');
        expect(onClose).toHaveBeenCalled();
    });

    it('should not select when clicking the doc link', async () => {
        const { onSelect } = setup();
        await userEvent.click(screen.getByRole('link'));
        expect(onSelect).not.toHaveBeenCalled();
    });

    it('should close on cancel', async () => {
        const { onClose, onSelect } = setup();
        await userEvent.click(screen.getByRole('button', { name: 'cancel' }));
        expect(onClose).toHaveBeenCalled();
        expect(onSelect).not.toHaveBeenCalled();
    });
});
