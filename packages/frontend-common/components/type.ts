export type FormFieldProps = {
    input: object;
    label?: string;
    meta: {
        touched: boolean;
        error?: Error;
    };
    multiple?: boolean;
};
