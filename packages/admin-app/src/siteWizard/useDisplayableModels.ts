import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getDisplayableModels, type CatalogModel } from '@lodex/common';
import modelsCatalog from '../../../../src/app/custom/models/models-catalog.json';
import { fromLoaders } from '../selectors';
import { hasTranslation } from './hasTranslation';

export const useDisplayableModels = (): CatalogModel[] => {
    const loaders: { name: string }[] = useSelector(fromLoaders.getLoaders);
    return useMemo(
        () =>
            getDisplayableModels(modelsCatalog, {
                availableLoaders: loaders.map(({ name }) => name),
                hasTranslation,
            }),
        [loaders],
    );
};
