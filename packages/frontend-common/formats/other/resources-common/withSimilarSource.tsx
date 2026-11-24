import { type ComponentType, type FunctionComponent } from 'react';
import { useFormContext, useWatch, type Control } from 'react-hook-form';

import { isSimilarResourcesSource } from './similarity';

// Gives the admin component `isSimilar`, true when the field's source is a
// similar-resources transformer. Without a form context it is always false.
const withSimilarSource = <P extends object>(
    Content: ComponentType<P & { isSimilar: boolean }>,
): FunctionComponent<P> => {
    // useWatch needs a form control: it is only called below, inside a form context.
    const WithForm = ({ control, ...props }: P & { control: Control }) => {
        const transformers = useWatch({ control, name: 'transformers' });
        return (
            <Content
                {...(props as unknown as P)}
                isSimilar={isSimilarResourcesSource(transformers)}
            />
        );
    };

    const WithSimilarSource = (props: P) => {
        const formContext = useFormContext();

        if (!formContext) {
            return <Content {...props} isSimilar={false} />;
        }

        return <WithForm {...props} control={formContext.control} />;
    };

    return WithSimilarSource;
};

export default withSimilarSource;
