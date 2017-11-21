export default () =>
    /https?:\/\/([\w-]+)/.exec(process.env.EZMASTER_PUBLIC_URL)[1];
