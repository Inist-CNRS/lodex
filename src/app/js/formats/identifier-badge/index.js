import Component from './IdentifierBadgeView';
import AdminComponent, { defaultArgs } from './IdentifierBadgeAdmin';
import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
    predicate: value => typeof value !== 'string',
};

export const resolvers = {
    DOI: 'http://dx.doi.org/',
    DOAI: 'http://doai.io/',
    PMID: 'https://www.ncbi.nlm.nih.gov/pubmed/',
};
