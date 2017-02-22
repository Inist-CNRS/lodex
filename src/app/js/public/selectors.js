import { createGlobalSelectors } from '../lib/selectors';
import { fromPublication as localFromPublication } from './publication';
import { fromDataset as localFromDataset } from './dataset';
import { fromCharacteristic as localFromCharacteristic } from './characteristic';
import { fromResource as localFromResource } from './resource';

const getPublicationState = state => state.publication;
export const fromPublication = createGlobalSelectors(getPublicationState, localFromPublication);

const getDatasetState = state => state.dataset;
export const fromDataset = createGlobalSelectors(getDatasetState, localFromDataset);

const getCharacteristicState = state => state.characteristic;
export const fromCharacteristic = createGlobalSelectors(getCharacteristicState, localFromCharacteristic);

const getResourceState = state => state.resource;
export const fromResource = createGlobalSelectors(getResourceState, localFromResource);
