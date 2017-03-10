import { createGlobalSelectors } from '../lib/selectors';
import { fromCharacteristic as localFromCharacteristic } from './characteristic';
import { fromDataset as localFromDataset } from './dataset';
import { fromFacet as localFromFacet } from './facet';
import { fromPublication as localFromPublication } from './publication';
import { fromResource as localFromResource } from './resource';

const getCharacteristicState = state => state.characteristic;
export const fromCharacteristic = createGlobalSelectors(getCharacteristicState, localFromCharacteristic);

const getDatasetState = state => state.dataset;
export const fromDataset = createGlobalSelectors(getDatasetState, localFromDataset);

const getFacetState = state => state.facet;
export const fromFacet = createGlobalSelectors(getFacetState, localFromFacet);

const getPublicationState = state => state.publication;
export const fromPublication = createGlobalSelectors(getPublicationState, localFromPublication);

const getResourceState = state => state.resource;
export const fromResource = createGlobalSelectors(getResourceState, localFromResource);
