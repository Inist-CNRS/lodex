import { Box, Link } from '@mui/material';
import type { CatalogModel } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

export const ModelLinks = ({ model }: { model: CatalogModel }) => {
    const { translate } = useTranslate();
    if (!model.doc && !model.demo) {
        return null;
    }
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            mt={0.5}
        >
            {model.doc && (
                <Link
                    variant="body1"
                    href={model.doc}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {translate('site_wizard_documentation_link')}
                </Link>
            )}
            {model.demo && (
                <Link
                    variant="body1"
                    href={model.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {translate('site_wizard_demo_link')}
                </Link>
            )}
        </Box>
    );
};
