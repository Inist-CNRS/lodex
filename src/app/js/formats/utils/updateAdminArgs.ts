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
    key extends keyof Args,
>(
    key: string,
    {
        args,
        onChange,
    }: {
        args: Args;
        onChange: (newState: Args) => void;
    },
) => {
    return (value: Args[key]) => {
        const newState = {
            ...args,
            [key]: value,
        };
        onChange(newState);
    };
};
