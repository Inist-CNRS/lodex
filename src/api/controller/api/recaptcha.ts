export async function verifyReCaptchaToken(ctx: any, { reCaptchaToken }: any) {
    const antispamFilterConfig = ctx.configTenant?.antispamFilter;
    if (
        !antispamFilterConfig?.active ||
        !antispamFilterConfig?.recaptchaSecretKey
    ) {
        return { success: true, score: 1.0 };
    }

    const formData = new FormData();
    formData.append('secret', antispamFilterConfig.recaptchaSecretKey);
    formData.append('response', reCaptchaToken);

    return fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: formData,
    }).then((response: any) => {
        if (!response.ok) {
            return Promise.reject(
                new Error('error_recaptcha_verification_failed'),
            );
        }
        return response.json();
    });
}
