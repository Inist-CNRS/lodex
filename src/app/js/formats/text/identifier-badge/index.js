import IdentifierBadgeView from './IdentifierBadgeView';
import AdminComponent, { defaultArgs } from './IdentifierBadgeAdmin';
import DefaultFormat from '../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component: IdentifierBadgeView,
    ListComponent: IdentifierBadgeView,
    AdminComponent,
    defaultArgs,
    predicate: (value) =>
        value == null || value === '' || typeof value === 'string',
};

export const resolvers = {
    DOI: 'http://dx.doi.org/',
    DOAI: 'http://oadoi.org/',
    PMID: 'https://www.ncbi.nlm.nih.gov/pubmed/',
    HAL: 'https://hal.archives-ouvertes.fr/',
    UID: '/',
    ARK: '/',
    ISBN: '#',
    ISSN: 'https://urn.issn.org/urn:issn:',
    eISSN: 'https://urn.issn.org/urn:issn:',
    PPN: 'https://www.sudoc.fr/',
    ORCID: 'https://orcid.org/',
    IDREF: 'https://www.idref.fr/',
    OAID: 'https://openalex.org/', // for id like W2081939991
};
