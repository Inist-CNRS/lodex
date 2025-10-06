import enrichers from '../../../custom/enrichers/enrichers-catalog.json';
import Catalog from '../../lib/components/Catalog';

const translatePrefix = 'ws';

type EnrichmentCatalogProps = {
    isOpen: boolean;
    handleClose: () => void;
    onChange: (value: string) => void;
    selectedWebServiceUrl: string;
};

export const EnrichmentCatalog = ({
    isOpen,
    handleClose,
    onChange,
    selectedWebServiceUrl,
}: EnrichmentCatalogProps) => (
    <Catalog
        {...{
            isOpen,
            handleClose,
            onChange,
            selectedWebServiceUrl,
            enrichers,
            translatePrefix,
        }}
    />
);

export default EnrichmentCatalog;
