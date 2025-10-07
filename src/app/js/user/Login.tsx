import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button, Card, CardHeader, Link } from '@mui/material';
import { useMemo } from 'react';
import { connect } from 'react-redux';

import LoginForm from './LoginForm';
import { useTranslate } from '../i18n/I18NContext';
import { login as loginAction } from './';

const styles = {
    container: {
        marginTop: '0.5rem',
    },
};

type LoginComponentProps = {
    login: (data: { username: string; password: string }) => void;
    target?: 'root' | 'admin';
};

export const LoginComponent = ({
    login,
    target = 'admin',
}: LoginComponentProps) => {
    const { translate } = useTranslate();
    const { href, title, className, color, subheader } = useMemo(() => {
        if (target === 'root') {
            return {
                href: '/instances',
                title: 'root_panel_link',
                subheader: 'admin_subheader', //'',
                className: 'rootPanel',
                color: '#4195e2',
            };
        }

        return {
            href: 'admin#/login',
            title: 'admin_panel_link',
            subheader: 'user_subheader', //'',
            className: 'adminPanel',
            color: '#7dbd42',
        };
    }, [target]);

    return (
        <Card sx={styles.container} className={className}>
            <CardHeader
                title={translate('Login')}
                subheader={translate(subheader)}
                action={
                    <Link
                        component={Button}
                        color="primary"
                        disableElevation
                        href={href}
                        startIcon={<OpenInNewIcon />}
                        sx={{
                            '&:hover': {
                                color,
                            },
                            color: '#626368',
                            marginInlineEnd: 1,
                        }}
                    >
                        {translate(title)}
                    </Link>
                }
            />
            <LoginForm onSubmit={login} />
        </Card>
    );
};

export const mapDispatchToProps = {
    login: loginAction,
};

export const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
