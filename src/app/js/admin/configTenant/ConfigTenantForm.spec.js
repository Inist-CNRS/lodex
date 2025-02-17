import React from 'react';
import { ConfigTenantFormView } from './ConfigTenantForm';
import { TestI18N } from '../../i18n/I18NContext';
import { fireEvent, render, waitFor } from '../../../../test-utils';

import configTenant from '../../../../../configTenant.json';
import user from '../../user';

function TestConfigTenantFormView(props) {
    return (
        <TestI18N>
            <ConfigTenantFormView {...props} />
        </TestI18N>
    );
}

const availableThemes = [
    {
        value: 'default',
        name: {
            fr: 'Système',
            en: 'System',
        },
        description: {
            fr: 'Thème système',
            en: 'System theme',
        },
        defaultVariables: {},
    },
    {
        value: 'nougat',
        name: {
            fr: 'Nougat',
            en: 'Nougat',
        },
        description: {
            fr: 'Thème système qui ressemble au Nougat',
            en: 'System theme that looks like Nougat',
        },
        defaultVariables: {
            for: 'nougat',
        },
    },
];

describe('ConfigTenantForm', () => {
    it('should render a form allowing to update config', async () => {
        const handleSave = jest.fn();
        const wrapper = render(
            <TestConfigTenantFormView
                initialConfig={configTenant}
                availableThemes={availableThemes}
                handleCancel={() => {}}
                handleSave={handleSave}
            />,
        );

        expect(
            wrapper.getByLabelText('enableAutoPublication'),
        ).toBeInTheDocument();
        expect(wrapper.getByLabelText('enableAutoPublication')).toBeChecked();

        expect(wrapper.getByLabelText('user_auth')).toBeInTheDocument();
        expect(wrapper.getByLabelText('user_auth')).toBeChecked();

        expect(
            wrapper.getAllByLabelText('Username', {}).at(0),
        ).toBeInTheDocument();
        expect(wrapper.getAllByLabelText('Username').at(0)).toHaveValue('user');

        expect(
            wrapper.getAllByLabelText('Password', {}).at(0),
        ).toBeInTheDocument();
        expect(wrapper.getAllByLabelText('Password').at(0)).toHaveValue(
            'secret',
        );

        expect(wrapper.getByLabelText('contributor_auth')).toBeInTheDocument();
        expect(wrapper.getByLabelText('contributor_auth')).not.toBeChecked();

        expect(
            wrapper.getAllByLabelText('Username', {}).at(1),
        ).toBeInTheDocument();
        expect(wrapper.getAllByLabelText('Username').at(1)).toHaveValue(
            'contributor',
        );

        expect(
            wrapper.getAllByLabelText('Password', {}).at(1),
        ).toBeInTheDocument();
        expect(wrapper.getAllByLabelText('Password').at(1)).toHaveValue(
            'secret',
        );

        expect(wrapper.getByLabelText('theme')).toBeInTheDocument();
        expect(wrapper.getByLabelText('theme')).toHaveValue('default');

        expect(
            wrapper.getByLabelText('enrichment_batch_size'),
        ).toBeInTheDocument();
        expect(wrapper.getByLabelText('enrichment_batch_size')).toHaveValue(10);

        // Cannot test AceEditor presence nor its value

        expect(wrapper.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('save'));
        });

        expect(handleSave).toHaveBeenCalledTimes(1);
        expect(handleSave).toHaveBeenCalledWith(configTenant);
    });
    it('should update front theme when changing theme', async () => {
        const handleSave = jest.fn();
        const wrapper = render(
            <TestConfigTenantFormView
                initialConfig={configTenant}
                availableThemes={availableThemes}
                handleCancel={() => {}}
                handleSave={handleSave}
            />,
        );

        expect(wrapper.getByLabelText('theme')).toBeInTheDocument();
        expect(wrapper.getByLabelText('theme')).toHaveValue('default');

        await waitFor(() => {
            fireEvent.change(wrapper.getByLabelText('theme'), {
                target: { value: 'nougat' },
            });
        });
        expect(wrapper.getByLabelText('theme')).toHaveValue('nougat');

        expect(wrapper.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('save'));
        });

        expect(handleSave).toHaveBeenCalledTimes(1);
        expect(handleSave).toHaveBeenCalledWith({
            ...configTenant,
            theme: 'nougat',
            front: {
                ...configTenant.front,
                theme: { for: 'nougat' },
            },
        });
    });
    it('should allow to update everything', async () => {
        const handleSave = jest.fn();
        const wrapper = render(
            <TestConfigTenantFormView
                initialConfig={configTenant}
                availableThemes={availableThemes}
                handleCancel={() => {}}
                handleSave={handleSave}
            />,
        );

        expect(
            wrapper.getByLabelText('enableAutoPublication'),
        ).toBeInTheDocument();
        await waitFor(() => {
            fireEvent.click(wrapper.getByLabelText('enableAutoPublication'));
        });
        expect(
            wrapper.getByLabelText('enableAutoPublication'),
        ).not.toBeChecked();

        await waitFor(() => {
            fireEvent.click(wrapper.getByLabelText('user_auth'));
        });
        expect(wrapper.getByLabelText('user_auth')).not.toBeChecked();

        await waitFor(() => {
            fireEvent.change(wrapper.getAllByLabelText('Username').at(0), {
                target: { value: 'newUser' },
            });
        });
        expect(wrapper.getAllByLabelText('Username').at(0)).toHaveValue(
            'newUser',
        );

        await waitFor(() => {
            fireEvent.change(wrapper.getAllByLabelText('Password').at(0), {
                target: { value: 'userSecret' },
            });
        });
        expect(wrapper.getAllByLabelText('Password').at(0)).toHaveValue(
            'userSecret',
        );

        await waitFor(() => {
            fireEvent.click(wrapper.getByLabelText('contributor_auth'));
        });
        expect(wrapper.getByLabelText('contributor_auth')).toBeChecked();

        await waitFor(() => {
            fireEvent.change(wrapper.getAllByLabelText('Username').at(1), {
                target: { value: 'newContributor' },
            });
        });
        expect(wrapper.getAllByLabelText('Username').at(1)).toHaveValue(
            'newContributor',
        );

        await waitFor(() => {
            fireEvent.change(wrapper.getAllByLabelText('Password').at(1), {
                target: { value: 'contributorSecret' },
            });
        });
        expect(wrapper.getAllByLabelText('Password').at(1)).toHaveValue(
            'contributorSecret',
        );

        await waitFor(() => {
            fireEvent.change(wrapper.getByLabelText('theme'), {
                target: { value: 'nougat' },
            });
        });
        expect(wrapper.getByLabelText('theme')).toHaveValue('nougat');
        await waitFor(() => {
            fireEvent.change(wrapper.getByLabelText('enrichment_batch_size'), {
                target: { value: '20' },
            });
        });
        expect(wrapper.getByLabelText('enrichment_batch_size')).toHaveValue(20);

        // Cannot test AceEditor presence nor its value

        expect(wrapper.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('save'));
        });

        expect(handleSave).toHaveBeenCalledTimes(1);
        expect(handleSave).toHaveBeenCalledWith({
            ...configTenant,
            enableAutoPublication: false,
            userAuth: {
                active: false,
                username: 'newUser',
                password: 'userSecret',
            },
            contributorAuth: {
                active: true,
                username: 'newContributor',
                password: 'contributorSecret',
            },
            enrichmentBatchSize: '20',
            theme: 'nougat',
            front: {
                ...configTenant.front,
                theme: { for: 'nougat' },
            },
        });
    });
});
