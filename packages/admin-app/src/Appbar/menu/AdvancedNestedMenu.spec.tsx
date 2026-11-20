import { fireEvent } from '@testing-library/dom';
import { TestI18N } from '@lodex/frontend-common/i18n/I18NContext.tsx';
import { AdvancedNestedMenuComponent } from './AdvancedNestedMenu.tsx';
import { render } from '../../test-utils.tsx';

jest.mock('./ExportDatasetButton.tsx', () => ({
    ExportDatasetButton: () => null,
}));

describe('AdvancedNestedMenu', () => {
    it('lets clear an empty dataset: the model (enrichments…) is cleared too', () => {
        const showDatasetClearDialog = jest.fn();
        const screen = render(
            <TestI18N>
                <AdvancedNestedMenuComponent
                    onClose={jest.fn()}
                    showDatasetClearDialog={showDatasetClearDialog}
                    hasLoadedDataset={false}
                />
            </TestI18N>,
        );
        const clearDataset = screen.getByRole('menuitem', {
            name: 'clear_dataset',
        });
        expect(clearDataset).not.toHaveAttribute('aria-disabled', 'true');
        fireEvent.click(clearDataset);
        expect(showDatasetClearDialog).toHaveBeenCalled();
    });
});
