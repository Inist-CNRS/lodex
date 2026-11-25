import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import { SiteWizardContext } from '../siteWizard/SiteWizardContext';
import { DataAddRouteComponent } from './DataAddRoute';

jest.mock('../upload/UploadPage', () => ({
    UploadPage: ({ onOpenWizard }: { onOpenWizard?: () => void }) => (
        <div data-testid="upload">
            {onOpenWizard && <button>site_wizard_open</button>}
        </div>
    ),
}));

const renderRoute = (canUploadFile: boolean) =>
    render(
        <SiteWizardContext.Provider value={{ openWizard: jest.fn() }}>
            <DataAddRouteComponent canUploadFile={canUploadFile} />
        </SiteWizardContext.Provider>,
    );

describe('DataAddRouteComponent', () => {
    it('should not offer the site wizard while data exists', () => {
        renderRoute(false);

        expect(screen.queryByText('site_wizard_open')).not.toBeInTheDocument();
    });

    it('should offer the site wizard once the dataset is empty', () => {
        renderRoute(true);

        expect(screen.getByText('site_wizard_open')).toBeInTheDocument();
    });
});
