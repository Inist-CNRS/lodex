export default (
    key: string,
    value: unknown,
    props: {
        args: Record<string, unknown>;
        onChange: (newState: Record<string, unknown>) => void;
    },
) => {
    const newState = {
        ...props.args,
        [key]: value,
    };
    props.onChange(newState);
};
