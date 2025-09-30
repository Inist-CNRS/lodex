// @ts-expect-error TS6133
import React from 'react';
import { ConfigTenantFormView } from './ConfigTenantForm';
import { TestI18N } from '../../i18n/I18NContext';
import { fireEvent, render, waitFor } from '../../../../test-utils.tsx';

import configTenant from '../../../../../configTenant.json';

// @ts-expect-error TS7006
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

        expect(wrapper.getByLabelText('user')).toBeInTheDocument();
        expect(wrapper.getByLabelText('user')).toBeChecked();

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

        expect(wrapper.getByLabelText('contributor')).toBeInTheDocument();
        expect(wrapper.getByLabelText('contributor')).not.toBeChecked();

        expect(
            wrapper.getByLabelText('notification_email'),
        ).toBeInTheDocument();
        expect(wrapper.getByLabelText('notification_email')).toHaveValue('');

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

    it.each([
        ['instance_is_private only_contributor_can_annotate', true, true],
        ['instance_is_public only_contributor_can_annotate', false, true],
        ['instance_is_private everyone_can_contribute', true, false],
        ['instance_is_public everyone_can_contribute', false, false],
    ])(
        'should display "%s" when userAuth.active is %s and contributorAuth.active is %s',
        async (message, userAuthActive, contributorAuthActive) => {
            const handleSave = jest.fn();
            const wrapper = render(
                <TestConfigTenantFormView
                    initialConfig={{
                        ...configTenant,
                        userAuth: {
                            active: userAuthActive,
                            username: null,
                            password: null,
                        },
                        contributorAuth: {
                            active: contributorAuthActive,
                            username: null,
                            password: null,
                        },
                    }}
                    availableThemes={availableThemes}
                    handleCancel={() => {}}
                    handleSave={handleSave}
                />,
            );
            expect(wrapper.getByText(message)).toBeInTheDocument();
        },
    );

    it('should reject invalid notification email', async () => {
        const handleSave = jest.fn();
        const wrapper = render(
            <TestConfigTenantFormView
                initialConfig={configTenant}
                availableThemes={availableThemes}
                handleCancel={() => {}}
                handleSave={handleSave}
            />,
        );

        await waitFor(() => {
            fireEvent.change(
                // @ts-expect-error TS2345
                wrapper.getAllByLabelText('notification_email').at(0),
                {
                    target: { value: 'invalidEmail' },
                },
            );
        });
        expect(
            wrapper.getAllByLabelText('notification_email').at(0),
        ).toHaveValue('invalidEmail');
        expect(wrapper.getByText('error_invalid_email')).toBeInTheDocument();

        expect(wrapper.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('save'));
        });

        expect(handleSave).toHaveBeenCalledTimes(0);
    });

    it('should accept no notification email', async () => {
        const handleSave = jest.fn();
        const wrapper = render(
            <TestConfigTenantFormView
                initialConfig={{
                    ...configTenant,
                    notificationEmail: 'admin@inist.fr',
                }}
                availableThemes={availableThemes}
                handleCancel={() => {}}
                handleSave={handleSave}
            />,
        );

        await waitFor(() => {
            fireEvent.change(
                // @ts-expect-error TS2345
                wrapper.getAllByLabelText('notification_email').at(0),
                {
                    target: { value: '' },
                },
            );
        });
        expect(
            wrapper.getAllByLabelText('notification_email').at(0),
        ).toHaveValue('');
        expect(
            wrapper.queryByText('error_invalid_email'),
        ).not.toBeInTheDocument();

        expect(wrapper.queryByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('save'));
        });

        expect(handleSave).toHaveBeenCalledTimes(1);
        expect(handleSave).toHaveBeenCalledWith({
            ...configTenant,
            notificationEmail: null,
        });
    });

    it('should reject null recaptchaClientKey and null recaptchaSecretKey when antispamFilter.active is true', async () => {
        const handleSave = jest.fn();
        const wrapper = render(
            <TestConfigTenantFormView
                initialConfig={{
                    ...configTenant,
                    antispamFilter: {
                        active: true,
                        recaptchaClientKey: null,
                        recaptchaSecretKey: null,
                    },
                }}
                availableThemes={availableThemes}
                handleCancel={() => {}}
                handleSave={handleSave}
            />,
        );

        expect(wrapper.getByLabelText('antispam_filter')).toBeInTheDocument();
        expect(wrapper.getByLabelText('antispam_filter')).toBeChecked();

        expect(
            wrapper.getByLabelText('recaptcha_client_key'),
        ).toBeInTheDocument();
        expect(wrapper.getByLabelText('recaptcha_client_key')).toHaveValue('');

        expect(
            wrapper.getByLabelText('recaptcha_secret_key'),
        ).toBeInTheDocument();
        expect(wrapper.getByLabelText('recaptcha_secret_key')).toHaveValue('');

        expect(wrapper.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('save'));
        });

        expect(handleSave).toHaveBeenCalledTimes(0);
    });

    it('should accept null recaptchaClientKey and null recaptchaSecretKey when antispamFilter.active is false', async () => {
        const handleSave = jest.fn();
        const wrapper = render(
            <TestConfigTenantFormView
                initialConfig={{
                    ...configTenant,
                    antispamFilter: {
                        active: false,
                        recaptchaClientKey: null,
                        recaptchaSecretKey: null,
                    },
                }}
                availableThemes={availableThemes}
                handleCancel={() => {}}
                handleSave={handleSave}
            />,
        );

        expect(wrapper.getByLabelText('antispam_filter')).toBeInTheDocument();
        expect(wrapper.getByLabelText('antispam_filter')).not.toBeChecked();

        expect(
            wrapper.getByLabelText('recaptcha_client_key'),
        ).toBeInTheDocument();
        expect(wrapper.getByLabelText('recaptcha_client_key')).toHaveValue('');

        expect(
            wrapper.getByLabelText('recaptcha_secret_key'),
        ).toBeInTheDocument();
        expect(wrapper.getByLabelText('recaptcha_secret_key')).toHaveValue('');

        expect(wrapper.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(wrapper.getByText('save'));
        });

        expect(handleSave).toHaveBeenCalledTimes(1);
        expect(handleSave).toHaveBeenCalledWith({
            ...configTenant,
            antispamFilter: {
                active: false,
                recaptchaClientKey: null,
                recaptchaSecretKey: null,
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
            fireEvent.click(wrapper.getByLabelText('user'));
        });
        expect(wrapper.getByLabelText('user')).not.toBeChecked();

        await waitFor(() => {
            // @ts-expect-error TS2345
            fireEvent.change(wrapper.getAllByLabelText('Username').at(0), {
                target: { value: 'newUser' },
            });
        });
        expect(wrapper.getAllByLabelText('Username').at(0)).toHaveValue(
            'newUser',
        );

        await waitFor(() => {
            // @ts-expect-error TS2345
            fireEvent.change(wrapper.getAllByLabelText('Password').at(0), {
                target: { value: 'userSecret' },
            });
        });
        expect(wrapper.getAllByLabelText('Password').at(0)).toHaveValue(
            'userSecret',
        );

        await waitFor(() => {
            fireEvent.click(wrapper.getByLabelText('contributor'));
        });
        expect(wrapper.getByLabelText('contributor')).toBeChecked();

        await waitFor(() => {
            // @ts-expect-error TS2345
            fireEvent.change(wrapper.getAllByLabelText('Username').at(1), {
                target: { value: 'newContributor' },
            });
        });
        expect(wrapper.getAllByLabelText('Username').at(1)).toHaveValue(
            'newContributor',
        );

        await waitFor(() => {
            // @ts-expect-error TS2345
            fireEvent.change(wrapper.getAllByLabelText('Password').at(1), {
                target: { value: 'contributorSecret' },
            });
        });
        expect(wrapper.getAllByLabelText('Password').at(1)).toHaveValue(
            'contributorSecret',
        );

        await waitFor(() => {
            fireEvent.change(
                // @ts-expect-error TS2345
                wrapper.getAllByLabelText('notification_email').at(0),
                {
                    target: { value: 'admin@inist.fr' },
                },
            );
        });
        expect(
            wrapper.getAllByLabelText('notification_email').at(0),
        ).toHaveValue('admin@inist.fr');

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
            notificationEmail: 'admin@inist.fr',
            enrichmentBatchSize: '20',
            theme: 'nougat',
            front: {
                ...configTenant.front,
                theme: { for: 'nougat' },
            },
        });
    });
});
