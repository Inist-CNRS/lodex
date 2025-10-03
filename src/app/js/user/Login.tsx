import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Card, CardHeader, Link } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { bindActionCreators } from 'redux';
import { isSubmitting } from 'redux-form';

import { translate } from '../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromUser } from '../sharedSelectors';
import { LOGIN_FORM_NAME, toggleLogin as toggleLoginAction } from './';
import LoginForm from './LoginForm';

const styles = {
    container: {
        marginTop: '0.5rem',
    },
};

export const LoginComponent = ({
    // @ts-expect-error TS7031
    login,
    // @ts-expect-error TS7031
    p: polyglot,
    target = 'admin',
}) => {
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
                title={polyglot.t('Login')}
                subheader={polyglot.t(subheader)}
                action={
                    <Link
                        // @ts-expect-error TS2769
                        variant="contained"
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
                        {polyglot.t(title)}
                    </Link>
                }
            />
            <LoginForm onSubmit={login} />
        </Card>
    );
};

LoginComponent.propTypes = {
    login: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    submit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    target: PropTypes.oneOf(['root', 'admin']),
};

LoginComponent.defaultProps = {
    previousState: null,
};

// @ts-expect-error TS7006
export const mapStateToProps = (state) => ({
    showModal: fromUser.isUserModalShown(state),
    submitting: isSubmitting(LOGIN_FORM_NAME)(state),
});

// @ts-expect-error TS7006
export const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            toggleLogin: toggleLoginAction,
        },
        dispatch,
    );

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
    // @ts-expect-error TS2345
)(LoginComponent);
