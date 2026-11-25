import { screen } from '@testing-library/react';
import { useLocation } from 'react-router';
import { render, userEvent } from '../test-utils';
import { SiteWizardContext } from '../siteWizard/SiteWizardContext';
import { DataAddRouteComponent } from './DataAddRoute';

jest.mock('../upload/UploadPage', () => ({
    UploadPage: ({ onOpenWizard }: { onOpenWizard?: () => void }) => (
        <div data-testid="upload">
            {onOpenWizard && (
                <button onClick={onOpenWizard}>site_wizard_open</button>
            )}
        </div>
    ),
}));

const Location = () => <p data-testid="location">{useLocation().pathname}</p>;

const openWizard = jest.fn();

const renderRoute = (canUploadFile: boolean) =>
    render(
        <SiteWizardContext.Provider value={{ openWizard }}>
            <DataAddRouteComponent canUploadFile={canUploadFile} />
            <Location />
        </SiteWizardContext.Provider>,
    );

describe('DataAddRouteComponent', () => {
    beforeEach(() => openWizard.mockClear());

    it('should not offer the site wizard while data exists', () => {
        renderRoute(false);

        expect(screen.queryByText('site_wizard_open')).not.toBeInTheDocument();
    });

    it('should open the site wizard on the data page once the dataset is empty', async () => {
        renderRoute(true);

        await userEvent.click(screen.getByText('site_wizard_open'));

        // the wizard only shows on the data page
        expect(screen.getByTestId('location')).toHaveTextContent(
            '/data/existing',
        );
        expect(openWizard).toHaveBeenCalledTimes(1);
    });
});
