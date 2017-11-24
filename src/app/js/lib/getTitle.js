export default () =>
    process.env.EZMASTER_PUBLIC_URL
        ? /https?:\/\/([\w-]+)/.exec(process.env.EZMASTER_PUBLIC_URL)[1]
        : 'example';
