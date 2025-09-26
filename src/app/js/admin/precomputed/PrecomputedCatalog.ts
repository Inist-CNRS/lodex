import enrichers from '../../../custom/precomputers/precomputers-catalog.json';
import Catalog from '../../lib/components/Catalog';

const translatePrefix = 'pc';

export const PrecomputedCatalog = ({
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
export default PrecomputedCatalog;
