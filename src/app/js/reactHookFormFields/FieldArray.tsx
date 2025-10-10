import type { ComponentType } from 'react';
import {
    useFieldArray,
    type UseFieldArrayReturn,
    useFormContext,
} from 'react-hook-form';

export const FieldArray = <ComponentProps extends object>({
    name,
    component: Component,
    ...props
}: Omit<ComponentProps, keyof UseFieldArrayReturn> & {
    name: string;
    component: ComponentType<ComponentProps & Partial<UseFieldArrayReturn>>;
}) => {
    const { control } = useFormContext();

    const fieldArray = useFieldArray({
        name,
        control,
    });

    const componentProps = {
        ...props,
        ...fieldArray,
    } as ComponentProps;

    return <Component {...componentProps} />;
};
