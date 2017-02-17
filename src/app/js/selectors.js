import { createSelector } from 'reselect';
import { fromPublication as localFromPublication } from './public';
import { fromDataset as localFromDataset } from './public/dataset';
import { fromCharacteristic as localFromCharacteristic } from './public/characteristic';

export const getProps = (state, props) => props;

export const createGlobalSelector = (getLocalState, selector) => createSelector(
    getLocalState,
    getProps,
    (localState, props) => selector(localState, props),
);

export const createGlobalSelectors = (getLocalState, selectors) => Object.keys(selectors).reduce((result, key) => ({
    ...result,
    [key]: createGlobalSelector(getLocalState, selectors[key]),
}), {});

const getPublicationState = state => state.public.publication;
export const fromPublication = createGlobalSelectors(getPublicationState, localFromPublication);

const getDatasetState = state => state.public.dataset;
export const fromDataset = createGlobalSelectors(getDatasetState, localFromDataset);

const getCharacteristicState = state => state.public.characteristic;
export const fromCharacteristic = createGlobalSelectors(getCharacteristicState, localFromCharacteristic);
