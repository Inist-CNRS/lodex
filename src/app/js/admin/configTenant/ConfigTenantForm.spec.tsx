import { ConfigTenantFormView } from './ConfigTenantForm';
import { TestI18N } from '../../i18n/I18NContext';
import { render } from '../../../../test-utils';

import configTenant from '../../../../../configTenant.json';
import { fireEvent, waitFor } from '@testing-library/dom';

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
        const screen = render(
            <TestConfigTenantFormView
                initialConfig={configTenant}
                availableThemes={availableThemes}
                handleCancel={() => {}}
                handleSave={handleSave}
            />,
        );

        expect(
            screen.getByLabelText('enableAutoPublication'),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('enableAutoPublication')).toBeChecked();

        expect(screen.getByLabelText('user')).toBeInTheDocument();
        expect(screen.getByLabelText('user')).toBeChecked();

        expect(
            screen.getAllByLabelText('Username', {}).at(0)!,
        ).toBeInTheDocument();
        expect(screen.getAllByLabelText('Username').at(0)).toHaveValue('user');

        expect(
            screen.getAllByLabelText('Password', {}).at(0)!,
        ).toBeInTheDocument();
        expect(screen.getAllByLabelText('Password').at(0)).toHaveValue(
            'secret',
        );

        expect(screen.getByLabelText('contributor')).toBeInTheDocument();
        expect(screen.getByLabelText('contributor')).not.toBeChecked();

        expect(screen.getByLabelText('notification_email')).toBeInTheDocument();
        expect(screen.getByLabelText('notification_email')).toHaveValue('');

        expect(
            screen.getAllByLabelText('Username', {}).at(1),
        ).toBeInTheDocument();
        expect(screen.getAllByLabelText('Username').at(1)).toHaveValue(
            'contributor',
        );

        expect(
            screen.getAllByLabelText('Password', {}).at(1),
        ).toBeInTheDocument();
        expect(screen.getAllByLabelText('Password').at(1)).toHaveValue(
            'secret',
        );

        expect(screen.getByLabelText('theme')).toBeInTheDocument();
        expect(screen.getByLabelText('theme')).toHaveValue('default');

        expect(
            screen.getByLabelText('enrichment_batch_size'),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('enrichment_batch_size')).toHaveValue(10);

        // Cannot test AceEditor presence nor its value

        expect(screen.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(screen.getByText('save'));
        });

        expect(handleSave).toHaveBeenCalledTimes(1);
        expect(handleSave).toHaveBeenCalledWith(configTenant);
    });
    it('should update front theme when changing theme', async () => {
        const handleSave = jest.fn();
        const screen = render(
            <TestConfigTenantFormView
                initialConfig={configTenant}
                availableThemes={availableThemes}
                handleCancel={() => {}}
                handleSave={handleSave}
            />,
        );

        expect(screen.getByLabelText('theme')).toBeInTheDocument();
        expect(screen.getByLabelText('theme')).toHaveValue('default');

        await waitFor(() => {
            fireEvent.change(screen.getByLabelText('theme'), {
                target: { value: 'nougat' },
            });
        });
        expect(screen.getByLabelText('theme')).toHaveValue('nougat');

        expect(screen.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(screen.getByText('save'));
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
            const screen = render(
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
            expect(screen.getByText(message)).toBeInTheDocument();
        },
    );

    it('should reject invalid notification email', async () => {
        const handleSave = jest.fn();
        const screen = render(
            <TestConfigTenantFormView
                initialConfig={configTenant}
                availableThemes={availableThemes}
                handleCancel={() => {}}
                handleSave={handleSave}
            />,
        );

        await waitFor(() => {
            fireEvent.change(
                screen.getAllByLabelText('notification_email').at(0)!,
                {
                    target: { value: 'invalidEmail' },
                },
            );
        });
        expect(
            screen.getAllByLabelText('notification_email').at(0)!,
        ).toHaveValue('invalidEmail');
        expect(screen.getByText('error_invalid_email')).toBeInTheDocument();

        expect(screen.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(screen.getByText('save'));
        });

        expect(handleSave).toHaveBeenCalledTimes(0);
    });

    it('should accept no notification email', async () => {
        const handleSave = jest.fn();
        const screen = render(
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
                screen.getAllByLabelText('notification_email').at(0)!,
                {
                    target: { value: '' },
                },
            );
        });
        expect(
            screen.getAllByLabelText('notification_email').at(0)!,
        ).toHaveValue('');
        expect(
            screen.queryByText('error_invalid_email'),
        ).not.toBeInTheDocument();

        expect(screen.queryByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(screen.getByText('save'));
        });

        expect(handleSave).toHaveBeenCalledTimes(1);
        expect(handleSave).toHaveBeenCalledWith({
            ...configTenant,
            notificationEmail: null,
        });
    });

    it('should reject null recaptchaClientKey and null recaptchaSecretKey when antispamFilter.active is true', async () => {
        const handleSave = jest.fn();
        const screen = render(
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

        expect(screen.getByLabelText('antispam_filter')).toBeInTheDocument();
        expect(screen.getByLabelText('antispam_filter')).toBeChecked();

        expect(
            screen.getByLabelText('recaptcha_client_key'),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('recaptcha_client_key')).toHaveValue('');

        expect(
            screen.getByLabelText('recaptcha_secret_key'),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('recaptcha_secret_key')).toHaveValue('');

        expect(screen.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(screen.getByText('save'));
        });

        expect(handleSave).toHaveBeenCalledTimes(0);
    });

    it('should accept null recaptchaClientKey and null recaptchaSecretKey when antispamFilter.active is false', async () => {
        const handleSave = jest.fn();
        const screen = render(
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

        expect(screen.getByLabelText('antispam_filter')).toBeInTheDocument();
        expect(screen.getByLabelText('antispam_filter')).not.toBeChecked();

        expect(
            screen.getByLabelText('recaptcha_client_key'),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('recaptcha_client_key')).toHaveValue('');

        expect(
            screen.getByLabelText('recaptcha_secret_key'),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('recaptcha_secret_key')).toHaveValue('');

        expect(screen.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(screen.getByText('save'));
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
        const screen = render(
            <TestConfigTenantFormView
                initialConfig={configTenant}
                availableThemes={availableThemes}
                handleCancel={() => {}}
                handleSave={handleSave}
            />,
        );

        expect(
            screen.getByLabelText('enableAutoPublication'),
        ).toBeInTheDocument();
        await waitFor(() => {
            fireEvent.click(screen.getByLabelText('enableAutoPublication'));
        });
        expect(
            screen.getByLabelText('enableAutoPublication'),
        ).not.toBeChecked();

        await waitFor(() => {
            fireEvent.click(screen.getByLabelText('user'));
        });
        expect(screen.getByLabelText('user')).not.toBeChecked();

        await waitFor(() => {
            fireEvent.change(screen.getAllByLabelText('Username').at(0)!, {
                target: { value: 'newUser' },
            });
        });
        expect(screen.getAllByLabelText('Username').at(0)).toHaveValue(
            'newUser',
        );

        await waitFor(() => {
            fireEvent.change(screen.getAllByLabelText('Password').at(0)!, {
                target: { value: 'userSecret' },
            });
        });
        expect(screen.getAllByLabelText('Password').at(0)).toHaveValue(
            'userSecret',
        );

        await waitFor(() => {
            fireEvent.click(screen.getByLabelText('contributor'));
        });
        expect(screen.getByLabelText('contributor')).toBeChecked();

        await waitFor(() => {
            fireEvent.change(screen.getAllByLabelText('Username').at(1)!, {
                target: { value: 'newContributor' },
            });
        });
        expect(screen.getAllByLabelText('Username').at(1)).toHaveValue(
            'newContributor',
        );

        await waitFor(() => {
            fireEvent.change(screen.getAllByLabelText('Password').at(1)!, {
                target: { value: 'contributorSecret' },
            });
        });
        expect(screen.getAllByLabelText('Password').at(1)).toHaveValue(
            'contributorSecret',
        );

        await waitFor(() => {
            fireEvent.change(
                screen.getAllByLabelText('notification_email').at(0)!,
                {
                    target: { value: 'admin@inist.fr' },
                },
            );
        });
        expect(
            screen.getAllByLabelText('notification_email').at(0)!,
        ).toHaveValue('admin@inist.fr');

        await waitFor(() => {
            fireEvent.change(screen.getByLabelText('theme'), {
                target: { value: 'nougat' },
            });
        });
        expect(screen.getByLabelText('theme')).toHaveValue('nougat');
        await waitFor(() => {
            fireEvent.change(screen.getByLabelText('enrichment_batch_size'), {
                target: { value: '20' },
            });
        });
        expect(screen.getByLabelText('enrichment_batch_size')).toHaveValue(20);

        // Cannot test AceEditor presence nor its value

        expect(screen.getByText('save')).toBeInTheDocument();

        await waitFor(() => {
            fireEvent.click(screen.getByText('save'));
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
