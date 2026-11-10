import { render, userEvent } from '../test-utils';
import { screen, within } from '@testing-library/react';
import type { CatalogModel } from '@lodex/common';
import { ModelStep } from './ModelStep';

jest.mock('./hasTranslation', () => ({ hasTranslation: () => true }));

const models: CatalogModel[] = [
    { id: 'a', url: 'http://a.tar', loader: 'la' },
    { id: 'b', url: 'http://b.tar', loader: 'lb' },
];

describe('ModelStep', () => {
    it('should list the models titles as options and call onSelect', async () => {
        const onSelect = jest.fn();
        render(
            <ModelStep models={models} selectedId="a" onSelect={onSelect} />,
        );
        await userEvent.click(screen.getByRole('combobox'));
        const listbox = within(screen.getByRole('listbox'));
        expect(
            listbox.getAllByRole('option').map((o) => o.textContent),
        ).toEqual(['mc_a_title', 'mc_b_title']);
        await userEvent.click(listbox.getByText('mc_b_title'));
        expect(onSelect).toHaveBeenCalledWith('b');
    });

    it('should leave the title and the subtitle to the wizard header', () => {
        render(
            <ModelStep models={models} selectedId="a" onSelect={jest.fn()} />,
        );
        expect(
            screen.queryByText('site_wizard_subtitle'),
        ).not.toBeInTheDocument();
        expect(screen.queryByText('site_wizard_title')).not.toBeInTheDocument();
    });

    it('should display a message when there is no model', () => {
        render(<ModelStep models={[]} selectedId="" onSelect={jest.fn()} />);
        expect(screen.getByText('site_wizard_no_model')).toBeInTheDocument();
    });

    it('should open the catalog dialog', async () => {
        render(
            <ModelStep models={models} selectedId="a" onSelect={jest.fn()} />,
        );
        await userEvent.click(
            screen.getByRole('button', { name: 'site_wizard_choose_model' }),
        );
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
    });
});
