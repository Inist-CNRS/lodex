export default (key, value, props) => {
    const newState = {
        ...props.args,
        [key]: value,
    };
    props.onChange(newState);
};
