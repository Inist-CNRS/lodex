import { FilterAlt } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import HomeIcon from '@mui/icons-material/Home';
import { Tooltip } from '@mui/material';
import React from 'react';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface IconProps {
    scope: string;
}

const Icon = React.forwardRef<HTMLElement, IconProps>(function Icon(
    { scope, ...rest },
    ref,
) {
    switch (scope) {
        case 'home':
            // @ts-expect-error TS2769
            return <HomeIcon {...rest} ref={ref} />;
        case 'document':
            // @ts-expect-error TS2769
            return <ArticleIcon {...rest} ref={ref} />;
        case 'subRessource':
            // @ts-expect-error TS2769
            return <DocumentScannerIcon {...rest} ref={ref} />;
        case 'facet':
            // @ts-expect-error TS2769
            return <FilterAlt {...rest} ref={ref} />;
        case 'chart':
            // @ts-expect-error TS2769
            return <EqualizerIcon {...rest} ref={ref} />;
        default:
            return null;
    }
});

interface FieldInternalIconProps {
    scope: string;
    p: unknown;
}

function FieldInternalIcon({ scope, ...rest }: FieldInternalIconProps) {
    const { translate } = useTranslate();
    if (scope) {
        return (
            <Tooltip title={translate(`${scope}_tooltip`)}>
                <Icon scope={scope} {...rest} />
            </Tooltip>
        );
    }
    return null;
}

export default FieldInternalIcon;
