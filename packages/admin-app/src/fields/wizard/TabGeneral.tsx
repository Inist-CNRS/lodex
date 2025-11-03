import FieldLabelInput from '../FieldLabelInput.tsx';

import FieldInternal from '../FieldInternal.tsx';
import SourceValueToggle from '../sourceValue/SourceValueToggle.tsx';
import type { Transformer } from '@lodex/frontend-common/fields/types.ts';
import TransformerList from '../transformers/TransformerList.tsx';
import { useFieldArray, useFormContext } from 'react-hook-form';

export const TabGeneralComponent = ({
    subresourceUri,
    arbitraryMode,
}: {
    subresourceUri?: string;
    arbitraryMode: boolean;
}) => {
    const { control } = useFormContext();
    const transformersArray = useFieldArray({
        name: 'transformers',
        control,
    });
    const transformers = (transformersArray.fields ||
        []) as unknown as Transformer[];
    const updateTransformers = transformersArray.replace;

    return (
        <>
            <FieldLabelInput />
            <FieldInternal />
            <SourceValueToggle
                transformers={transformers}
                updateTransformers={updateTransformers}
                selectedSubresourceUri={subresourceUri}
                arbitraryMode={arbitraryMode}
            />
            <TransformerList
                {...transformersArray}
                type="transform"
                fields={transformers}
                isSubresourceField={!!subresourceUri}
            />
        </>
    );
};

export default TabGeneralComponent;
