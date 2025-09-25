import enrichers from '../../../custom/enrichers/enrichers-catalog.json';
import Catalog from '../../lib/components/Catalog';

const translatePrefix = 'ws';

export const EnrichmentCatalog = ({
    isOpen,
    handleClose,
    onChange,
    selectedWebServiceUrl,
}) =>
    Catalog({
        isOpen,
        handleClose,
        onChange,
        selectedWebServiceUrl,
        enrichers,
        translatePrefix,
    });

export default EnrichmentCatalog;
