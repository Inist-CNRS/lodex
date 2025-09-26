import enrichers from '../../../custom/enrichers/enrichers-catalog.json';
import Catalog from '../../lib/components/Catalog';

const translatePrefix = 'ws';

export const EnrichmentCatalog = ({
    // @ts-expect-error TS7031
    isOpen,
    // @ts-expect-error TS7031
    handleClose,
    // @ts-expect-error TS7031
    onChange,
    // @ts-expect-error TS7031
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
