import { screen } from '@testing-library/react';
import { render, userEvent } from '../test-utils';
import { SiteWizardContext } from '../siteWizard/SiteWizardContext';
import { DataRouteComponent } from './DataRoute';

jest.mock('../upload/Upload', () => ({
    __esModule: true,
    default: ({ onOpenWizard }: { onOpenWizard?: () => void }) => (
        <div data-testid="upload">
            {onOpenWizard && (
                <button onClick={onOpenWizard}>site_wizard_open</button>
            )}
        </div>
    ),
}));

jest.mock('../parsing/ParsingResult', () => ({
    __esModule: true,
    default: () => <div data-testid="parsing-result" />,
}));

jest.mock('./useFetchPrecomputations', () => ({
    useFetchPrecomputations: () => ({
        isPrecomputationsLoading: false,
        precomputations: [],
        precomputationsError: null,
    }),
}));

const openWizard = jest.fn();

const renderRoute = (canUploadFile: boolean) =>
    render(
        <SiteWizardContext.Provider value={{ openWizard }}>
            <DataRouteComponent
                canUploadFile={canUploadFile}
                hasPublishedDataset={false}
            />
        </SiteWizardContext.Provider>,
    );

describe('DataRouteComponent', () => {
    beforeEach(() => openWizard.mockClear());

    it('should let the upload screen reopen the site wizard when the instance is empty', async () => {
        renderRoute(true);

        expect(screen.getByTestId('upload')).toBeInTheDocument();
        await userEvent.click(screen.getByText('site_wizard_open'));
        expect(openWizard).toHaveBeenCalledTimes(1);
    });

    it('should not render the upload screen when data exists', () => {
        renderRoute(false);

        expect(screen.queryByTestId('upload')).not.toBeInTheDocument();
        expect(screen.queryByText('site_wizard_open')).not.toBeInTheDocument();
    });
});
