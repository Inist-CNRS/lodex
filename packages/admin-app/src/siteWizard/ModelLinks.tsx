import { Link, Typography } from '@mui/material';
import { getModelTitleKey, type CatalogModel } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const ExternalLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer">
        {label}
    </Link>
);

// "OpenAlex model: access the documentation and the demo site"
export const ModelLinks = ({ model }: { model: CatalogModel }) => {
    const { translate } = useTranslate();
    if (!model.doc && !model.demo) {
        return null;
    }
    return (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
            {translate('site_wizard_model_links', {
                name: translate(getModelTitleKey(model.id)),
            })}{' '}
            {model.doc && (
                <ExternalLink
                    href={model.doc}
                    label={translate('site_wizard_model_links_doc')}
                />
            )}
            {model.doc && model.demo && ` ${translate('site_wizard_and')} `}
            {model.demo && (
                <ExternalLink
                    href={model.demo}
                    label={translate('site_wizard_model_links_demo')}
                />
            )}
        </Typography>
    );
};
