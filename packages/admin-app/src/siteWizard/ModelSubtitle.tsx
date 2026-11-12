import { Typography } from '@mui/material';
import { getModelTitleKey, type CatalogModel } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

// In French, "Modèle OpenAlex" reads "le modèle OpenAlex" inside a sentence.
// English titles start with the model's name ("OpenAlex model"): keep them.
export const getModelNameInSentence = (title: string, locale: 'fr' | 'en') =>
    locale === 'fr' ? title.slice(0, 1).toLowerCase() + title.slice(1) : title;

// a subtitle naming the model inside a sentence
export const ModelSubtitle = ({
    model,
    translationKey,
}: {
    model: CatalogModel;
    translationKey: string;
}) => {
    const { translate, locale } = useTranslate();
    return (
        <Typography color="text.secondary">
            {translate(translationKey, {
                name: getModelNameInSentence(
                    translate(getModelTitleKey(model.id)),
                    locale,
                ),
            })}
        </Typography>
    );
};
