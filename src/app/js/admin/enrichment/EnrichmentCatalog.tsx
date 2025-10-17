import { useController } from 'react-hook-form';
import enrichers from '../../../custom/enrichers/enrichers-catalog.json';
import Catalog from '../../lib/components/Catalog';

const translatePrefix = 'ws';

type EnrichmentCatalogProps = {
    isOpen: boolean;
    handleClose: () => void;
};

export const EnrichmentCatalog = ({
    isOpen,
    handleClose,
}: EnrichmentCatalogProps) => {
    const { field } = useController({
        name: 'webServiceUrl',
    });
    return (
        <Catalog
            {...{
                isOpen,
                handleClose,
                onChange: field.onChange,
                selectedWebServiceUrl: field.value,
                enrichers,
                translatePrefix,
            }}
        />
    );
};

export default EnrichmentCatalog;
