const transformation = ({ applyJbjStylesheet }, args) => (value) => {
    const stylesheetArg = args.find(a => a.name === 'stylesheet');

    if (!stylesheetArg || !stylesheetArg.value) {
        return Promise.resolve('');
    }

    return applyJbjStylesheet(value, stylesheetArg.value);
};

transformation.getMetas = () => ({
    name: 'JBJ',
    type: 'transform',
    args: [
        { name: 'stylesheet', type: 'text' },
    ],
});

export default transformation;
