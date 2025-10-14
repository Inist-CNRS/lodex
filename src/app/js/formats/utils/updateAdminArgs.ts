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

export const useUpdateAdminArgs = <
    Args extends Record<string, unknown>,
    Key extends keyof Args,
    Value = Args[Key],
>(
    key: string,
    {
        args,
        onChange,
        parseValue,
    }: {
        args: Args;
        onChange: (newState: Args) => void;
        parseValue?: (value: Value) => Args[Key];
    },
) => {
    return (value: Value) => {
        const newState = {
            ...args,
            [key]: parseValue ? parseValue(value) : value,
        };

        onChange(newState);
    };
};
