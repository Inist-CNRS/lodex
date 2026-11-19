import { TestI18N } from '@lodex/frontend-common/i18n/I18NContext.tsx';
import { ModelNestedMenuComponent } from './ModelNestedMenu.tsx';
import { render } from '../../test-utils.tsx';

const renderMenu = (hasLoadedDataset: boolean, nbFields: number) =>
    render(
        <TestI18N>
            <ModelNestedMenuComponent
                onClose={jest.fn()}
                hasPublishedDataset={false}
                hasLoadedDataset={hasLoadedDataset}
                exportFields={jest.fn()}
                importFields={jest.fn()}
                showModelClearDialog={jest.fn()}
                nbFields={nbFields}
            />
        </TestI18N>,
    );

const isDisabled = (screen: ReturnType<typeof render>, name: string) =>
    screen.getByRole('menuitem', { name }).getAttribute('aria-disabled') ===
    'true';

describe('ModelNestedMenu', () => {
    it('lets export and clear a model without data', () => {
        const screen = renderMenu(false, 3);
        expect(isDisabled(screen, 'export_fields')).toBe(false);
        expect(isDisabled(screen, 'clear_model')).toBe(false);
    });

    it('disables them without data nor model', () => {
        const screen = renderMenu(false, 0);
        expect(isDisabled(screen, 'export_fields')).toBe(true);
        expect(isDisabled(screen, 'clear_model')).toBe(true);
    });
});
