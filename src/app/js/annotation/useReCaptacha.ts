import { useCallback, useMemo } from 'react';

export function useReCaptcha() {
    const reCaptcha = useMemo(() => {
        // @ts-expect-error TS2339
        if (window.RECAPTCHA_CLIENT_KEY && window.grecaptcha) {
            // @ts-expect-error TS2339
            return window.grecaptcha;
        }

        return {
            // @ts-expect-error TS7006
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
                        // @ts-expect-error TS2339
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
