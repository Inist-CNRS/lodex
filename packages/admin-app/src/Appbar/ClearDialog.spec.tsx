import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { getStore, Wrapper } from '../test-utils';
import { ClearDialogComponent } from './ClearDialog';

jest.mock('../api/field', () => ({}));

const themes = [
    {
        value: 'default',
        name: { en: 'default', fr: 'default' },
        description: { en: '', fr: '' },
        defaultVariables: { siteTitle: '', summary: '' },
    },
];

const renderDialog = ({
    hasModel = false,
    config = { theme: 'default', front: { theme: {} } },
    clearError,
}: {
    hasModel?: boolean;
    config?: object;
    clearError?: string;
} = {}) => {
    const client = new QueryClient();
    client.setQueryData(['get-config-tenant'], config);
    client.setQueryData(['get-available-themes'], themes);
    const noop = () => {};
    render(
        <Wrapper store={getStore()} client={client}>
            <ClearDialogComponent
                type="dataset"
                succeeded={false}
                isLoading={false}
                hasFailed={!!clearError}
                clearError={clearError}
                hasPublishedDataset={false}
                hasModel={hasModel}
                onClose={noop}
                clearDataset={noop}
                clearPublished={noop}
                loadField={noop}
                loadPublication={noop}
                loadSubResources={noop}
                exportFields={noop}
            />
        </Wrapper>,
    );
};

describe('ClearDialog (dataset)', () => {
    // e.g. a job that does not stop: a retry later may work
    it('explains why the clear failed', () => {
        renderDialog({ clearError: 'jobs_still_running' });
        expect(screen.getByText('jobs_still_running')).toBeInTheDocument();
    });

    it('hides the export prompt when there is nothing to keep', () => {
        renderDialog();
        expect(screen.queryByText('export_fields')).toBeNull();
        expect(screen.queryByText('listen_up_dataset_export')).toBeNull();
    });

    it('shows the export prompt when the theme is customized', () => {
        renderDialog({
            config: {
                theme: 'default',
                front: { theme: { customCss: 'body {}' } },
            },
        });
        expect(screen.getByText('export_fields')).toBeTruthy();
        expect(screen.getByText('listen_up_dataset_export')).toBeTruthy();
    });

    it('shows the export prompt when the model has fields', () => {
        renderDialog({ hasModel: true });
        expect(screen.getByText('export_fields')).toBeTruthy();
    });
});
