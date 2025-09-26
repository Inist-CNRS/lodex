import enrichers from '../../../custom/precomputers/precomputers-catalog.json';
import Catalog from '../../lib/components/Catalog';

const translatePrefix = 'pc';

export const PrecomputedCatalog = ({
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
export default PrecomputedCatalog;
