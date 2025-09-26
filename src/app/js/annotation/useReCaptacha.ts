import { useCallback, useMemo } from 'react';

export function useReCaptcha() {
    const reCaptcha = useMemo(() => {
        if (window.RECAPTCHA_CLIENT_KEY && window.grecaptcha) {
            return window.grecaptcha;
        }

        return {
            ready: function (cb) {
                return cb();
            },
            execute: function () {
                return Promise.resolve(null);
            },
        };
    }, []);

    const requestReCaptchaToken = useCallback(
        async (action = 'submit') => {
            return new Promise((resolve, reject) => {
                reCaptcha.ready(() => {
                    reCaptcha
                        .execute(window.RECAPTCHA_CLIENT_KEY, { action })
                        .then(resolve)
                        .catch(reject);
                });
            });
        },
        [reCaptcha],
    );

    return useMemo(() => ({ requestReCaptchaToken }), [requestReCaptchaToken]);
}
